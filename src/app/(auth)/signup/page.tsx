import React from 'react'
import SignUpForm from './SignUpForm'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign Up",
}

const page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <section className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <SignUpForm />
        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </section>
    </div>
  )
}

export default page
