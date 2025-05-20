"use client"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

import { Input } from "@/components/ui/input"

const formSchema = z.object({
    BusinessName: z.string().min(2).max(50),
    BusinessType: z.string().min(2).max(50),
    RegisteredBusinessAddress: z.string().min(2).max(100),
    TaxNumber: z.string(),
    MonthlyRevenue: z.string().min(2).max(50),
    AverageMonthlyBankBalance: z.string(),
    PrimaryBankName: z.string().min(2).max(50),
    TotalExistingLoanAmount: z.string(),
    ContactPerson: z.string().min(2).max(50),
    ContactPersonEmail: z.string().email()
})
type FormData = z.infer<typeof formSchema>;

export function LoanproposalForm() {
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
        console.log("hello")
    }

      return (
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
    )
}
