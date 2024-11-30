import React from 'react'
import LogInForm from './LogInForm'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign Up",
}


const page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <section className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center">Log In</h1>
        <LogInForm />
        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 font-medium hover:underline">
            Create Acount
          </Link>
        </p>
      </section>
    </div>
  )
}

export default page
