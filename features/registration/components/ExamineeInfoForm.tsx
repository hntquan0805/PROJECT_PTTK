"use client"

import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserCheck, CreditCard, Phone, Mail } from "lucide-react"
import type { RegistrationInfoForm } from "../schemas"

interface ExamineeInfoFormProps {
  form: UseFormReturn<RegistrationInfoForm>
}

export function ExamineeInfoForm({ form }: ExamineeInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Thông tin thí sinh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="examineeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên thí sinh *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên thí sinh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="examineeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                CCCD/CMND *
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập số CCCD/CMND" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="examineePhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Số điện thoại
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập số điện thoại (không bắt buộc)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="examineeEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="Nhập email (không bắt buộc)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
