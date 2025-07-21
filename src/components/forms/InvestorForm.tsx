"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface InvestorFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Professional Information
  companyName: string;
  jobTitle: string;
  yearsOfExperience: string;
  industry: string;

  // Investment Profile
  investmentAmount: string;
  investmentFrequency: string;
  preferredIndustries: string[];
  investmentStage: string[];

  // Financial Information
  annualIncome: string;
  netWorth: string;
  accreditedInvestor: boolean;

  // Investment Experience
  previousInvestments: string;
  investmentGoals: string;
  riskTolerance: string;

  // Portfolio Preferences
  preferredGeographicRegions: string[];
  minimumInvestment: string;
  maximumInvestment: string;

  // Legal & Compliance
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export default function InvestorForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<InvestorFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    jobTitle: "",
    yearsOfExperience: "",
    industry: "",
    investmentAmount: "",
    investmentFrequency: "",
    preferredIndustries: [],
    investmentStage: [],
    annualIncome: "",
    netWorth: "",
    accreditedInvestor: false,
    previousInvestments: "",
    investmentGoals: "",
    riskTolerance: "",
    preferredGeographicRegions: [],
    minimumInvestment: "",
    maximumInvestment: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Partial<InvestorFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const handleInputChange = (
    field: keyof InvestorFormData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleArrayChange = (
    field: keyof InvestorFormData,
    value: string,
    checked: boolean
  ) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);
    handleInputChange(field, newArray);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<InvestorFormData> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Email is invalid";
        if (!formData.phone.trim())
          newErrors.phone = "Phone number is required";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords do not match";
        break;

      case 2:
        if (!formData.companyName.trim())
          newErrors.companyName = "Company name is required";
        if (!formData.jobTitle.trim())
          newErrors.jobTitle = "Job title is required";
        if (!formData.yearsOfExperience.trim())
          newErrors.yearsOfExperience = "Years of experience is required";
        if (!formData.industry.trim())
          newErrors.industry = "Industry is required";
        break;

      case 3:
        if (!formData.investmentAmount.trim())
          newErrors.investmentAmount = "Investment amount is required";
        if (!formData.investmentFrequency.trim())
          newErrors.investmentFrequency = "Investment frequency is required";
        if (formData.preferredIndustries.length === 0)
          newErrors.preferredIndustries =
            "Please select at least one preferred industry";
        if (formData.investmentStage.length === 0)
          newErrors.investmentStage =
            "Please select at least one investment stage";
        break;

      case 4:
        if (!formData.annualIncome.trim())
          newErrors.annualIncome = "Annual income is required";
        if (!formData.netWorth.trim())
          newErrors.netWorth = "Net worth is required";
        if (!formData.riskTolerance.trim())
          newErrors.riskTolerance = "Risk tolerance is required";
        break;

      case 5:
        if (!formData.agreeToTerms)
          newErrors.agreeToTerms = "You must agree to the terms of service";
        if (!formData.agreeToPrivacy)
          newErrors.agreeToPrivacy = "You must agree to the privacy policy";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setIsLoading(true);
      setSubmitError("");

      try {
        const registrationData = {
          ...formData,
          role: "investor" as const,
        };

        await register(registrationData);
        router.push("/dashboard/investor");
      } catch (error: any) {
        setSubmitError(
          error.message || "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Personal Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Professional Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange("companyName", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.companyName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Title *
        </label>
        <input
          type="text"
          value={formData.jobTitle}
          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.jobTitle ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.jobTitle && (
          <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience *
        </label>
        <select
          value={formData.yearsOfExperience}
          onChange={(e) =>
            handleInputChange("yearsOfExperience", e.target.value)
          }
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.yearsOfExperience ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Experience</option>
          <option value="0-2">0-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="6-10">6-10 years</option>
          <option value="11-15">11-15 years</option>
          <option value="15+">15+ years</option>
        </select>
        {errors.yearsOfExperience && (
          <p className="text-red-500 text-sm mt-1">
            {errors.yearsOfExperience}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry *
        </label>
        <select
          value={formData.industry}
          onChange={(e) => handleInputChange("industry", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.industry ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Industry</option>
          <option value="finance">Finance</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="real-estate">Real Estate</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="retail">Retail</option>
          <option value="consulting">Consulting</option>
          <option value="legal">Legal</option>
          <option value="other">Other</option>
        </select>
        {errors.industry && (
          <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Investment Profile
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Typical Investment Amount *
        </label>
        <select
          value={formData.investmentAmount}
          onChange={(e) =>
            handleInputChange("investmentAmount", e.target.value)
          }
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.investmentAmount ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Amount</option>
          <option value="1k-5k">$1,000 - $5,000</option>
          <option value="5k-10k">$5,000 - $10,000</option>
          <option value="10k-25k">$10,000 - $25,000</option>
          <option value="25k-50k">$25,000 - $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="100k+">$100,000+</option>
        </select>
        {errors.investmentAmount && (
          <p className="text-red-500 text-sm mt-1">{errors.investmentAmount}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Investment Frequency *
        </label>
        <select
          value={formData.investmentFrequency}
          onChange={(e) =>
            handleInputChange("investmentFrequency", e.target.value)
          }
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.investmentFrequency ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Frequency</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="biannually">Biannually</option>
          <option value="annually">Annually</option>
          <option value="as-opportunities-arise">As opportunities arise</option>
        </select>
        {errors.investmentFrequency && (
          <p className="text-red-500 text-sm mt-1">
            {errors.investmentFrequency}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Industries *
        </label>
        <div className="space-y-2">
          {[
            "Technology",
            "Healthcare",
            "Finance",
            "Real Estate",
            "Manufacturing",
            "Retail",
            "Education",
            "Food & Beverage",
            "Energy",
            "Transportation",
          ].map((industry) => (
            <label key={industry} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferredIndustries.includes(
                  industry.toLowerCase()
                )}
                onChange={(e) =>
                  handleArrayChange(
                    "preferredIndustries",
                    industry.toLowerCase(),
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{industry}</span>
            </label>
          ))}
        </div>
        {errors.preferredIndustries && (
          <p className="text-red-500 text-sm mt-1">
            {errors.preferredIndustries}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Investment Stages *
        </label>
        <div className="space-y-2">
          {[
            "Idea Stage",
            "MVP/Prototype",
            "Early Revenue",
            "Growth Stage",
            "Scaling",
          ].map((stage) => (
            <label key={stage} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.investmentStage.includes(
                  stage.toLowerCase().replace(" ", "-")
                )}
                onChange={(e) =>
                  handleArrayChange(
                    "investmentStage",
                    stage.toLowerCase().replace(" ", "-"),
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{stage}</span>
            </label>
          ))}
        </div>
        {errors.investmentStage && (
          <p className="text-red-500 text-sm mt-1">{errors.investmentStage}</p>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Financial & Risk Profile
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Annual Income *
        </label>
        <select
          value={formData.annualIncome}
          onChange={(e) => handleInputChange("annualIncome", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.annualIncome ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Income Range</option>
          <option value="under-50k">Under $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="100k-200k">$100,000 - $200,000</option>
          <option value="200k-500k">$200,000 - $500,000</option>
          <option value="500k-1m">$500,000 - $1,000,000</option>
          <option value="1m+">$1,000,000+</option>
        </select>
        {errors.annualIncome && (
          <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Net Worth *
        </label>
        <select
          value={formData.netWorth}
          onChange={(e) => handleInputChange("netWorth", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.netWorth ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Net Worth</option>
          <option value="under-100k">Under $100,000</option>
          <option value="100k-250k">$100,000 - $250,000</option>
          <option value="250k-500k">$250,000 - $500,000</option>
          <option value="500k-1m">$500,000 - $1,000,000</option>
          <option value="1m-5m">$1,000,000 - $5,000,000</option>
          <option value="5m+">$5,000,000+</option>
        </select>
        {errors.netWorth && (
          <p className="text-red-500 text-sm mt-1">{errors.netWorth}</p>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="accreditedInvestor"
          checked={formData.accreditedInvestor}
          onChange={(e) =>
            handleInputChange("accreditedInvestor", e.target.checked)
          }
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label
          htmlFor="accreditedInvestor"
          className="text-sm font-medium text-gray-700"
        >
          I am an accredited investor
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Risk Tolerance *
        </label>
        <select
          value={formData.riskTolerance}
          onChange={(e) => handleInputChange("riskTolerance", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.riskTolerance ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Risk Tolerance</option>
          <option value="conservative">Conservative</option>
          <option value="moderate">Moderate</option>
          <option value="aggressive">Aggressive</option>
          <option value="very-aggressive">Very Aggressive</option>
        </select>
        {errors.riskTolerance && (
          <p className="text-red-500 text-sm mt-1">{errors.riskTolerance}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Previous Investment Experience
        </label>
        <textarea
          value={formData.previousInvestments}
          onChange={(e) =>
            handleInputChange("previousInvestments", e.target.value)
          }
          rows={3}
          placeholder="Describe your previous investment experience..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Investment Goals
        </label>
        <textarea
          value={formData.investmentGoals}
          onChange={(e) => handleInputChange("investmentGoals", e.target.value)}
          rows={3}
          placeholder="What are your investment goals?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Investment
          </label>
          <select
            value={formData.minimumInvestment}
            onChange={(e) =>
              handleInputChange("minimumInvestment", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Minimum</option>
            <option value="1k">$1,000</option>
            <option value="5k">$5,000</option>
            <option value="10k">$10,000</option>
            <option value="25k">$25,000</option>
            <option value="50k">$50,000</option>
            <option value="100k+">$100,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Investment
          </label>
          <select
            value={formData.maximumInvestment}
            onChange={(e) =>
              handleInputChange("maximumInvestment", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Maximum</option>
            <option value="10k">$10,000</option>
            <option value="25k">$25,000</option>
            <option value="50k">$50,000</option>
            <option value="100k">$100,000</option>
            <option value="250k">$250,000</option>
            <option value="500k+">$500,000+</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Terms & Conditions
      </h3>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={(e) =>
              handleInputChange("agreeToTerms", e.target.checked)
            }
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
          />
          <div>
            <label
              htmlFor="agreeToTerms"
              className="text-sm font-medium text-gray-700"
            >
              I agree to the Terms of Service *
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToPrivacy"
            checked={formData.agreeToPrivacy}
            onChange={(e) =>
              handleInputChange("agreeToPrivacy", e.target.checked)
            }
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
          />
          <div>
            <label
              htmlFor="agreeToPrivacy"
              className="text-sm font-medium text-gray-700"
            >
              I agree to the Privacy Policy *
            </label>
            {errors.agreeToPrivacy && (
              <p className="text-red-500 text-sm mt-1">
                {errors.agreeToPrivacy}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-md">
        <h4 className="font-medium text-green-900 mb-2">
          Important Information
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Investment in startups carries significant risk</li>
          <li>• Past performance does not guarantee future results</li>
          <li>• You may lose your entire investment</li>
          <li>
            • Investments are illiquid and may take years to realize returns
          </li>
          <li>• Please consult with a financial advisor before investing</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">
          Accredited Investor Status
        </h4>
        <p className="text-sm text-blue-800">
          Accredited investors have access to a wider range of investment
          opportunities. To qualify, you must meet certain income or net worth
          requirements as defined by the SEC.
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{submitError}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of 5
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / 5) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      {renderCurrentStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
        )}

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit Registration"}
          </button>
        )}
      </div>
    </form>
  );
}
