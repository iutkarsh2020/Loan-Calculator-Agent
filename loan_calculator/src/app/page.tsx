"use client";
import Image from "next/image";
import {LoanproposalForm, LoanProposalCard} from "./my_sheets/Loanproposal";
import { useState } from "react";
export enum states{
  LOAN_PROPOSAL_FORM,
  LOAN_DENIED_STATE,
  PARSE_STATEMENT_STATE
}
interface FormHookState{
  state: states,
  message: string
}

export default function Home() {
  const [currentState, changeCurrentState] = useState({state: states.LOAN_PROPOSAL_FORM, message: ""} as FormHookState);
  return (
    <div className="h-[70%] w-screen flex justify-center items-center bg-slate-100">
      {currentState.state === states.LOAN_PROPOSAL_FORM && <LoanProposalCard changeCurrentState={changeCurrentState} contents={<LoanproposalForm changeCurrentState={changeCurrentState}/>}/> }
    </div>
  );
}
