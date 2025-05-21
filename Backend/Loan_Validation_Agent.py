from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from langchain_core.messages import HumanMessage, SystemMessage, AnyMessage
import google.generativeai as genai
from pdf2image import convert_from_path
from PIL import Image

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

