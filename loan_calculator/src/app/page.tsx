"use client";
import Image from "next/image";
import {LoanproposalForm, LoanProposalCard} from "./my_sheets/Loanproposal";
import { useState } from "react";
import { PdfUploadForm } from "./my_sheets/PdfUploadForm";
import LoadingScreen from "./my_sheets/LoadingScreen";
import { Analysis, callResult } from "./my_sheets/Analysis";
export enum states{
  LOAN_PROPOSAL_FORM,
  LOAN_DENIED_STATE,
  PDF_UPLOAD_STATE,
  PARSE_STATEMENT_STATE,
  STATEMENT_RESULT_STATE
}
export interface FormHookState{
  state: states,
  message: string,
  amount: number,
  Result: callResult
}


export default function Home() {
  const [currentState, changeCurrentState] = useState({state: states.PARSE_STATEMENT_STATE, message: "", amount: 2000} as FormHookState);
  const [file, changeFile] = useState<File | null>(null);
  console.log(currentState)
  return (
    <div className="h-[70%] w-screen flex justify-center items-center bg-slate-100">
      {(currentState.state === states.LOAN_PROPOSAL_FORM && <LoanProposalCard currentState={currentState} changeFile = {changeFile} changeCurrentState={changeCurrentState} contents={<LoanproposalForm changeCurrentState={changeCurrentState}/>}/>) || 
      (currentState.state === states.LOAN_DENIED_STATE && <LoanProposalCard currentState={currentState} changeFile = {changeFile} changeCurrentState={changeCurrentState} contents={currentState.message}/> ||
      (currentState.state === states.PDF_UPLOAD_STATE && <LoanProposalCard currentState={currentState} changeFile = {changeFile} changeCurrentState={changeCurrentState} contents={ <PdfUploadForm currentState={currentState} changeFile = {changeFile} changeCurrentState={changeCurrentState}/> }  />) ||
      (currentState.state === states.PARSE_STATEMENT_STATE && <LoanProposalCard currentState={currentState} changeFile = {changeFile} changeCurrentState={changeCurrentState} contents={ <LoadingScreen /> }  />) ||
      (currentState.state === states.STATEMENT_RESULT_STATE && <LoanProposalCard currentState={currentState} changeFile = {changeFile} changeCurrentState={changeCurrentState} contents={ <Analysis currentState={currentState} changeCurrentState={changeCurrentState}/> }  />)
      )}
    </div>
  );
}
