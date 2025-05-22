"use client"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction, useState } from "react"
import { FormHookState, states } from "../page"
import { PdfUploadForm } from "./PdfUploadForm"
import { Analysis } from "./Analysis"
import LoadingScreen from "./LoadingScreen"

interface LoanProposalCardProps {
    contents: React.ReactNode,
    currentState: FormHookState,
    changeCurrentState: Dispatch<SetStateAction<FormHookState>>
    changeFile: Dispatch<SetStateAction<File | null>>
}
interface LoanProposalFormProps {
    changeCurrentState: Dispatch<SetStateAction<FormHookState>>
}
const formSchema = z.object({
    BusinessName: z.string(),
    BusinessType: z.string(),
    RegisteredBusinessAddress: z.string(),
    TaxNumber: z.string(),
    MonthlyRevenue: z.string(),
    AverageMonthlyBankBalance: z.string(),
    PrimaryBankName: z.string(),
    TotalExistingLoanAmount: z.string(),
    LoanAmount: z.string(),
    ContactPerson: z.string(),
    ContactPersonEmail: z.string().email()
})
type FormData = z.infer<typeof formSchema>;

export function LoanProposalCard( prop : LoanProposalCardProps){
    return (
        <Card className="w-[80%] min-h-[75vh] flex flex-col">
          <CardHeader >
            <CardTitle>{prop.contents?.type === LoanproposalForm && "Loan Proposal Form" || prop.contents?.type === PdfUploadForm && "Upload Bank Statement" || prop.contents?.type === Analysis && "Document Analysis Complete" || prop.contents?.type === LoadingScreen && "Analysing your statement"}</CardTitle>
            <CardDescription>{prop.contents?.type === LoanproposalForm && "Please fill out this form correctly." || prop.contents?.type === PdfUploadForm && "We need your bank statement to provide the best customized loan offer for you." || prop.contents?.type === Analysis && "Based on the uploaded statement, here's the result" || prop.contents?.type === LoadingScreen && "Please wait while we find you the best offer"}</CardDescription>
          </CardHeader>
          <CardContent className="h-min-[80vh] items-center justify-center">
          {(prop.contents?.type === "LoanproposalForm" && (
          <LoanproposalForm changeCurrentState={prop.changeCurrentState} />
        )) ||
          (prop.contents?.type === PdfUploadForm && (
            <PdfUploadForm currentState={prop.currentState} changeFile = {prop.changeFile} changeCurrentState={prop.changeCurrentState} />
          )) ||
          (prop.contents?.type === Analysis && (
            <Analysis currentState={prop.currentState} changeCurrentState={prop.changeCurrentState} />
          )) ||
          prop.contents}
          </CardContent>
        </Card>
      )
}
export function LoanproposalForm({ changeCurrentState }: LoanProposalFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            BusinessName: "",
            BusinessType: "",
            RegisteredBusinessAddress: "",
            TaxNumber: "",
            MonthlyRevenue: "",
            AverageMonthlyBankBalance: "",
            PrimaryBankName: "",
            LoanAmount: "",
            TotalExistingLoanAmount: "",
            ContactPerson: "",
            ContactPersonEmail: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const monthlyRevenue = parseFloat(values.MonthlyRevenue.replace(/,/g, ""));
        const avgBankBalance = parseFloat(values.AverageMonthlyBankBalance.replace(/,/g, ""));
        const existingLoanAmount = parseFloat(values.TotalExistingLoanAmount.replace(/,/g, ""));
        const loanAmount = parseFloat(values.LoanAmount.replace(/,/g, ""));
        changeCurrentState((prev) => ({...prev, Amount: loanAmount}))
        // Initial screening rules
        if (monthlyRevenue < 50000) {
            let message = "Rejected: Monthly revenue below ₹50,000.\nWe're sorry, but your monthly revenue does not meet our minimum eligibility."
            changeCurrentState((prev) => ({...prev,state: states.LOAN_DENIED_STATE, message: message }));
            return
        }

        const unsupportedIndustries = ["Crypto", "Adult Content", "Gambling"];
        if (unsupportedIndustries.includes(values.BusinessType)) {
            let message = "Rejected: Unsupported industry type.\nUnfortunately, we cannot support this industry type for lending."
            changeCurrentState((prev) => ({...prev,state: states.LOAN_DENIED_STATE, message: message }));
            return
        }

        if (existingLoanAmount > 1000000) {
            let message = "Rejected: Too much existing debt.\nWe are unable to proceed due to high existing loan obligations."
            changeCurrentState((prev) => ({...prev,state: states.LOAN_DENIED_STATE, message: message }));
            return
        }

        // If all checks pass, continue to PDF upload
    
        changeCurrentState((prev) => ({...prev,state: states.PDF_UPLOAD_STATE, message: "Passed Initial Filtering" }));
    }

      return (
        
        <div >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Business Name */}
                    <FormField
                    control={form.control}
                    name="BusinessName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. Casca" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Business Type */}
                    <FormField
                    control={form.control}
                    name="BusinessType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. Private Ltd" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Registered Business Address */}
                    <FormField
                    control={form.control}
                    name="RegisteredBusinessAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Registered Business Address</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. Union Square, San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Tax Number */}
                    <FormField
                    control={form.control}
                    name="TaxNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tax Number</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. 1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Monthly Revenue */}
                    <FormField
                    control={form.control}
                    name="MonthlyRevenue"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Monthly Revenue ($)</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. 80000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Average Monthly Bank Balance */}
                    <FormField
                    control={form.control}
                    name="AverageMonthlyBankBalance"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Average Monthly Bank Balance ($)</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. 120000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Primary Bank Name */}
                    <FormField
                    control={form.control}
                    name="PrimaryBankName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Primary Bank Name</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. Bank of America" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Total Existing Loan Amount */}
                    <FormField
                    control={form.control}
                    name="TotalExistingLoanAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Existing Loan Amount (₹)</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. 200000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {/* Current Loan Amount */}
                    <FormField
                    control={form.control}
                    name="LoanAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Current Loan Amount</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. 200000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Contact Person */}
                    <FormField
                    control={form.control}
                    name="ContactPerson"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="e.g. Utkarsh Sharma" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Contact Person Email */}
                    <FormField
                    control={form.control}
                    name="ContactPersonEmail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contact Person Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="e.g. utkarshsharma@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}
