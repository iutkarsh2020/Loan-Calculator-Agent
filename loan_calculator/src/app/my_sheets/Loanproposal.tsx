"use client"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui"
const formSchema = z.object({
    BusinessName: z.string().min(2).max(50),
    BusinessType: z.string().min(2).max(50),
    IncorporationData: z.date(),
    RegisteredBusinessAddress: z.string().min(2).max(100),
    TaxNumber: z.number(),
    MonthlyRevenue: z.number(),
    AverageMonthlyBankBalance: z.number(),
    PrimaryBankName: z.string().min(2).max(50),
    TotalExistingLoanAmount: z.number(),
    ContactPerson: z.string().min(2).max(50),
    ContactPersonEmail: z.string().email()
})


export function LoanproposalForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            BusinessName: "",
            BusinessType: "",
            IncorporationData: new Date(),
            RegisteredBusinessAddress: "",
            TaxNumber: 0,
            MonthlyRevenue: 0,
            AverageMonthlyBankBalance: 0,
            PrimaryBankName: "",
            TotalExistingLoanAmount: 0,
            ContactPerson: "",
            ContactPersonEmail: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
      }

      return (
        <Form {...form}>

            </Form>
      )
}
