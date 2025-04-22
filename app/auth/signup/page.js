// app/auth/signup/page.js
'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Sign up to start renting cars</p>
        </div>
        <div className="bg-white p-8 shadow-md rounded-lg">
          <SignUp 
            path="/auth/signup"
            routing="path"
            signInUrl="/auth/signin"
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}