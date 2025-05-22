# backend/main.py

from pdf2image import convert_from_bytes
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from Loan_Validation_Agent import loan_validationAgent
app = FastAPI()

# Allow frontend to communicate (localhost:3000 is Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"message": "✅ Backend is running!"}

@app.post("/upload")
async def get_loan_decision(file: UploadFile = File(...),
    loanAmount: int = Form(...)):
    # print("Hello")
    # content = await file.read()
    # images = convert_from_bytes(content, dpi=200)
    # response = loan_validationAgent(loanAmount, images)
    # print(response)
    # return response
    return {'Data_Quality': True, 'Data_Quality_Reason': 'Financial data available for loan assessment.', 'Loan_Approved': 'Manual inspection', 'Reason': 'Average Monthly Balance data is missing, and Cash Inflow Consistency is erratic, making it hard to decide.'}
