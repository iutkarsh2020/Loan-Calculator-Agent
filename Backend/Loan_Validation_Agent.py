from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from langchain_core.messages import HumanMessage, SystemMessage, AnyMessage
import google.generativeai as genai
from pdf2image import convert_from_path
from PIL import Image
import re
import os

GOOGLE_GEMINI_API_KEY = "AIzaSyDL2xXx4eyI-Ljv_JmO-7K5cNpcTvjqaa4"
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)

class AgentState(TypedDict):
    parse_query: str
    quality_check_prompt: str
    aggregation_prompt: str
    extracted_json: [list[str]]
    messages: Annotated[list[AnyMessage], "Message history"]
    final_decision: str
    filtered_json: str

system_message = '''
You are a loan agent responsible for approving or rejecting business loan applications.

You are given:
1. A requested loan amount
2. A JSON containing structured financial metrics for a company

Your task is to evaluate whether the company qualifies for the loan based on the following rules:

---

LOAN APPROVAL RULES(Focus on rules that are present, if it is too hard to decide based on the rules, mark for manual inspection):
1. Average Monthly Balance (AMB): should be **at least 50% of the requested loan amount**.
2. Monthly surplus (Cash Inflows - Cash Outflows): should be at least 1.5× the estimated EMI, where:
   - EMI = loan_amount / 12 (assume a 1-year repayment period).
3. Bounced Cheques / Failed Transactions: If more than 2 in recent months → Reject.
4. Minimum Balance Maintained: should be **at least 20% of the requested loan amount**.
5. Cash Inflow Consistency:
   - "Steady" is preferred.
   - If inflows are "Erratic" and total inflows are < 75% of the loan amount → Reject.
6. If any essential data is missing, proceed with caution and explain your uncertainty.
7. Justify the decision in 2–3 lines.

---

Return the result as a JSON in the following format:
{
  "Loan_Approved": true/false/Manual inspection,
  "Reason": "<short, specific justification>"
}

---

Here is the input:

Loan Amount: <LOAN_AMOUNT>

Financial Metrics JSON:
<COMPANY_FINANCIAL_JSON>

'''

initial_state = AgentState(
    {'parse_query': '''You are an expert image content extractor. You go through each line of the image, check if the current content, understand it and convert it into content aware json.
    Once you have collected json data for every line of image, you return it. You do not use markdowns, comments, just a JSON which you are an expert of.
    Finally you return this Json.
    ''',
     'quality_check_prompt': '''You are a loan agent, you will be given Json form of bank statement of 1 company. 
     Do the following:
      a) Read the json, it is for 1 company, construct a new json which only has new information derived from old one
      b) The new Json should contain the following:
     -
     1) Average Monthly Balance (AMB) - Average of daily closing balances per month.
     2) Cash Inflows (Credits) - Total monthly credits, Consistency of inflows (steady vs. erratic)
     3) Cash Outflows (Debits) - Total monthly debits, Nature of outflows (salary, vendor payments, loan EMI, etc.)
     4) Bounced Cheques / Failed Transactions - Frequency and reason (e.g., insufficient balance?)
     5) Loan Repayments or EMIs
     6) Minimum Balance Maintained
     7) High-Value Transactions
     8) Salary Payments
     9) Incoming Payment Delays or Irregularities''',
     'aggregation_prompt': '''You are a loan agent, here you are given findings from different pages of a statement pdf in Json form. You are required to find the effective value of each Json element
     Additionally, you read the effective json, and add the following keys.
     Data_Quality: True | False, This is the first screening round. If the current Json data contains company's financial that can later be used for loan approval/rejection then return True, else False
     Data_Quality_Reason: Make the reason small but effective, just 1 reason for yes or no, short and simple.
     Return a JSON output
     ''',
     'decision_prompt': '''You are a loan agent, you get a Loan amount and Json of company financials. You do the following'''
     
    }
)
class Agent:
    def __init__(self, system_message, amount, tools, images):
        self.system_message = system_message
        self.images = images
        self.amount = str(amount)
        self.llm = genai.GenerativeModel('gemini-2.0-flash')
        graph = StateGraph(AgentState)
        graph.add_node("parse_pdf", self.parse_pdf)
        graph.add_node("filter_json", self.filter_json)
        graph.add_node("decision_maker", self.approve_or_reject)
        graph.add_node("generate_report", self.generate_report)
        graph.add_conditional_edges("filter_json", # will return generated metrics here that can be used in later stages
                                    self.data_quality_check,
                                    {True: "decision_maker", False: END},
        )
        graph.add_edge("parse_pdf", "filter_json")
        graph.add_edge("decision_maker", "generate_report")
        graph.set_entry_point("parse_pdf")
        self.graph = graph.compile()
        
    def parse_pdf(self, state):
        prompt = state['parse_query']
        extracted_json = []
        for image in self.images:
            contents = [prompt, image]
            response = self.llm.generate_content(contents)
            if response and response.candidates and response.candidates[0].content.parts:
                extracted_json.append(response.candidates[0].content.parts[0].text)
            else:
                extracted_json.append('{}')
        return {'extracted_json': extracted_json}

    def filter_json(self, state):
        prompt = state['quality_check_prompt']
        extracted_json = state['extracted_json']
        refined_json = []
        for i in range(0, len(extracted_json), 2):
            contents = [prompt, extracted_json[i]]
            if i+1<len(extracted_json):
                contents.append(extracted_json[i+1])
            current_refined_json = self.llm.generate_content(contents)
            refined_json.append(current_refined_json.candidates[0].content.parts[0].text)
        to_return_json = self.llm.generate_content([state['aggregation_prompt'], 'NEXT_JSON'.join(refined_json)])
        to_return_json = to_return_json.candidates[0].content.parts[0].text
        return {'filtered_json': to_return_json}
    
    def approve_or_reject(self, state):
        decision = self.llm.generate_content([self.system_message, state['filtered_json'], "Loan amount is : "+ self.amount])
        decision = decision.candidates[0].content.parts[0].text
        return {'final_decision': decision}
        
    def generate_report(self, state):
        
        return {'extracted_json': []}
    def data_quality_check(self, state):
        to_return_json = state['filtered_json']
        match = re.search(r'"Data_Quality"\s*:\s*(true|false)', to_return_json)
        state['filtered_json'] = to_return_json

        return match.group(1).lower() == 'true'

def extract_field(s: str, key: str, default):
    # Matches: "Key": true / false / "some string"
    match = re.search(rf'"{key}"\s*:\s*(true|false|"[^"]*")', s)
    if not match:
        return default
    value = match.group(1)
    # Convert string booleans or strip quotes
    if value == "true":
        return True
    elif value == "false":
        return False
    elif value.startswith('"'):
        return value.strip('"')
    return default

def loan_validationAgent(loan_amount, images) -> dict: 
    my_agent = Agent(system_message, loan_amount, None, images)
    final_state = my_agent.graph.invoke(initial_state)
    s1 = final_state['final_decision']
    s2= final_state['filtered_json']
    output = {
        "Data_Quality": extract_field(s2, "Data_Quality", False),
        "Data_Quality_Reason": extract_field(s2, "Data_Quality_Reason", ""),
        "Loan_Approved": extract_field(s1, "Loan_Approved", False),
        "Reason": extract_field(s1, "Reason", "")
    }
    return output 


