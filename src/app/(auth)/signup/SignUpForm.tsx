"use client"

import LoadingButton from "@/components/LoadingButton";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
// import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    startTransition(async () => {
      await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then( (response) => {
        if (!response.ok) {
          throw new Error("An error occurred while submitting the form")
        }
        router.push("/dashboard")
        return response
      }).catch( (error) => {
        form.setError("email", {
          type: "manual",
          message: error.error,
        })
      })

      
      })
    
  }
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" disabled={isPending} {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@xyz.com" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide Password" : "ShowPassword"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground">
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" loading={isPending} className="w-full">Create Account</LoadingButton>
      </form>
    </Form>
  )
}

export default SignUpForm
