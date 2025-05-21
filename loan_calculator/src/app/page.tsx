"use client";
import Image from "next/image";
import {LoanproposalForm, LoanProposalCard} from "./my_sheets/Loanproposal";
import { useState } from "react";
import { PdfUploadForm } from "./my_sheets/PdfUploadForm";
export enum states{
  LOAN_PROPOSAL_FORM,
  LOAN_DENIED_STATE,
  PDF_UPLOAD_STATE,
  PARSE_STATEMENT_STATE
}
export interface FormHookState{
  state: states,
  message: string
}

export default function Home() {
  const [currentState, changeCurrentState] = useState({state: states.PDF_UPLOAD_STATE, message: ""} as FormHookState);
  return (
    <div className="h-[70%] w-screen flex justify-center items-center bg-slate-100">
      {(currentState.state === states.LOAN_PROPOSAL_FORM && <LoanProposalCard changeCurrentState={changeCurrentState} contents={<LoanproposalForm changeCurrentState={changeCurrentState}/>}/>) || 
      (currentState.state === states.LOAN_DENIED_STATE && <LoanProposalCard changeCurrentState={changeCurrentState} contents={currentState.message}/> ||
      (currentState.state === states.PDF_UPLOAD_STATE && <LoanProposalCard changeCurrentState={changeCurrentState} contents={ <PdfUploadForm changeCurrentState={changeCurrentState}/> }  />)
      )}
    </div>
  );
}
