"use client"

import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { User, Phone, Mail } from "lucide-react"
import type { RegistrationInfoForm } from "../schemas"

interface RegistrantInfoFormProps {
  form: UseFormReturn<RegistrationInfoForm>
}

export function RegistrantInfoForm({ form }: RegistrantInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Thông tin người đăng ký
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="registrantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên người đăng ký" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registrantPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Số điện thoại *
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập số điện thoại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registrantEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="Nhập địa chỉ email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden field for customer type - always individual */}
        <FormField
          control={form.control}
          name="customerType"
          render={({ field }) => <input type="hidden" {...field} value="individual" />}
        />
      </CardContent>
    </Card>
  )
}
