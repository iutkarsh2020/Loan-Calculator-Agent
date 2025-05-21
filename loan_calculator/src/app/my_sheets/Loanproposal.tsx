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
import { states } from "../page"

interface LoanProposalCardProps {
    contents: React.ReactNode,
    changeCurrentState: Dispatch<SetStateAction<{
        state: states;
        message: string;
    }>>
}
interface LoanProposalFormProps {
    changeCurrentState: Dispatch<SetStateAction<{
        state: states;
        message: string;
    }>>
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
    ContactPerson: z.string(),
    ContactPersonEmail: z.string().email()
})
type FormData = z.infer<typeof formSchema>;

export function LoanProposalCard( prop : LoanProposalCardProps){
    return (
        <Card className="w-[70%]">
          <CardHeader>
            <CardTitle>Loan Proposal Form</CardTitle>
            <CardDescription>Please fill out this form correctly.</CardDescription>
          </CardHeader>
          <CardContent>
            {(prop.contents?.type === LoanproposalForm && <LoanproposalForm changeCurrentState={prop.changeCurrentState}/>) || prop.contents}
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
            TotalExistingLoanAmount: "",
            ContactPerson: "",
            ContactPersonEmail: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const monthlyRevenue = parseFloat(values.MonthlyRevenue.replace(/,/g, ""));
        const avgBankBalance = parseFloat(values.AverageMonthlyBankBalance.replace(/,/g, ""));
        const existingLoanAmount = parseFloat(values.TotalExistingLoanAmount.replace(/,/g, ""));

        // Initial screening rules
        if (monthlyRevenue < 50000) {
            let message = "Rejected: Monthly revenue below ₹50,000.\nWe're sorry, but your monthly revenue does not meet our minimum eligibility."
            changeCurrentState({state: states.LOAN_DENIED_STATE, message: message});
            return
        }

        const unsupportedIndustries = ["Crypto", "Adult Content", "Gambling"];
        if (unsupportedIndustries.includes(values.BusinessType)) {
            let message = "Rejected: Unsupported industry type.\nUnfortunately, we cannot support this industry type for lending."
            changeCurrentState({state: states.LOAN_DENIED_STATE, message: message});
            return
        }

        if (existingLoanAmount > 1000000) {
            let message = "Rejected: Too much existing debt.\nWe are unable to proceed due to high existing loan obligations."
            changeCurrentState({state: states.LOAN_DENIED_STATE, message: message});
            return
        }

        // If all checks pass, continue to PDF upload
    
        changeCurrentState({state: states.PARSE_STATEMENT_STATE, message: "Passed Initial Filtering"});
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
