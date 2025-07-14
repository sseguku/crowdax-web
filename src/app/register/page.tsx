"use client";

import { useState } from "react";
import Link from "next/link";
import EntrepreneurForm from "@/components/forms/EntrepreneurForm";
import InvestorForm from "@/components/forms/InvestorForm";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<
    "entrepreneur" | "investor" | null
  >(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Crowdax
          </h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </div>

        {!selectedRole ? (
          <div className="space-y-4">
            <div
              onClick={() => setSelectedRole("entrepreneur")}
              className="bg-white rounded-lg p-6 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Entrepreneur
                  </h3>
                  <p className="text-sm text-gray-600">
                    Launch and grow your business with funding
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedRole("investor")}
              className="bg-white rounded-lg p-6 border-2 border-transparent hover:border-green-500 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Investor
                  </h3>
                  <p className="text-sm text-gray-600">
                    Invest in promising startups and earn returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedRole === "entrepreneur"
                  ? "Entrepreneur Registration"
                  : "Investor Registration"}
              </h2>
              <div className="w-5"></div>
            </div>

            {selectedRole === "entrepreneur" ? (
              <EntrepreneurForm />
            ) : (
              <InvestorForm />
            )}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
