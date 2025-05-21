# backend/main.py

from pdf2image import convert_from_bytes
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from Loan_Validation_Agent import loan_validationAgent
app = FastAPI()

# Allow frontend to communicate (localhost:3000 is Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"message": "✅ Backend is running!"}

@app.post("/upload")
async def get_loan_decision(file: UploadFile = File(...),
    loan_amount: int = Form(...)):
    content = await file.read()
    images = convert_from_bytes(content, dpi=200)
    response = loan_validationAgent(loan_amount, images)
    return {
        "filename": file.filename,
        "size": len(content),
        "message": "File received successfully"
    }
