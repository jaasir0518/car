// app/auth/signin/page.js
'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-gray-600">Welcome back! Sign in to your account</p>
        </div>
        <div className="bg-white p-8 shadow-md rounded-lg">
          <SignIn 
            path="/auth/signin"
            routing="path"
            signUpUrl="/auth/signup"
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}