"use client";

import { useState } from "react";

interface EntrepreneurFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Business Information
  companyName: string;
  industry: string;
  businessStage: string;
  foundedDate: string;
  website: string;

  // Business Details
  description: string;
  problemSolved: string;
  targetMarket: string;
  competitiveAdvantage: string;

  // Financial Information
  fundingAmount: string;
  fundingPurpose: string;
  currentRevenue: string;
  projectedRevenue: string;

  // Team Information
  teamSize: string;
  coFounders: string;

  // Legal & Compliance
  businessRegistered: boolean;
  taxId: string;
  legalStructure: string;
}

export default function EntrepreneurForm() {
  const [formData, setFormData] = useState<EntrepreneurFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industry: "",
    businessStage: "",
    foundedDate: "",
    website: "",
    description: "",
    problemSolved: "",
    targetMarket: "",
    competitiveAdvantage: "",
    fundingAmount: "",
    fundingPurpose: "",
    currentRevenue: "",
    projectedRevenue: "",
    teamSize: "",
    coFounders: "",
    businessRegistered: false,
    taxId: "",
    legalStructure: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Partial<EntrepreneurFormData>>({});

  const handleInputChange = (
    field: keyof EntrepreneurFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<EntrepreneurFormData> = {};

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
        if (!formData.industry.trim())
          newErrors.industry = "Industry is required";
        if (!formData.businessStage.trim())
          newErrors.businessStage = "Business stage is required";
        if (!formData.foundedDate)
          newErrors.foundedDate = "Founded date is required";
        break;

      case 3:
        if (!formData.description.trim())
          newErrors.description = "Business description is required";
        if (!formData.problemSolved.trim())
          newErrors.problemSolved = "Problem solved is required";
        if (!formData.targetMarket.trim())
          newErrors.targetMarket = "Target market is required";
        break;

      case 4:
        if (!formData.fundingAmount.trim())
          newErrors.fundingAmount = "Funding amount is required";
        if (!formData.fundingPurpose.trim())
          newErrors.fundingPurpose = "Funding purpose is required";
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
      // Here you would typically send the data to your API
      console.log("Entrepreneur registration data:", formData);
      alert("Registration submitted successfully!");
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
        Business Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange("companyName", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.companyName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry *
        </label>
        <select
          value={formData.industry}
          onChange={(e) => handleInputChange("industry", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.industry ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Industry</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="food-beverage">Food & Beverage</option>
          <option value="real-estate">Real Estate</option>
          <option value="other">Other</option>
        </select>
        {errors.industry && (
          <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Stage *
        </label>
        <select
          value={formData.businessStage}
          onChange={(e) => handleInputChange("businessStage", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.businessStage ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Stage</option>
          <option value="idea">Idea Stage</option>
          <option value="mvp">MVP/Prototype</option>
          <option value="early-revenue">Early Revenue</option>
          <option value="growth">Growth Stage</option>
          <option value="scaling">Scaling</option>
        </select>
        {errors.businessStage && (
          <p className="text-red-500 text-sm mt-1">{errors.businessStage}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Founded Date *
        </label>
        <input
          type="date"
          value={formData.foundedDate}
          onChange={(e) => handleInputChange("foundedDate", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.foundedDate ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.foundedDate && (
          <p className="text-red-500 text-sm mt-1">{errors.foundedDate}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          placeholder="https://yourcompany.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Business Details
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          placeholder="Describe your business, what you do, and your mission..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Problem You're Solving *
        </label>
        <textarea
          value={formData.problemSolved}
          onChange={(e) => handleInputChange("problemSolved", e.target.value)}
          rows={3}
          placeholder="What problem does your business solve?"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.problemSolved ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.problemSolved && (
          <p className="text-red-500 text-sm mt-1">{errors.problemSolved}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Market *
        </label>
        <textarea
          value={formData.targetMarket}
          onChange={(e) => handleInputChange("targetMarket", e.target.value)}
          rows={3}
          placeholder="Who is your target market?"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.targetMarket ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.targetMarket && (
          <p className="text-red-500 text-sm mt-1">{errors.targetMarket}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Competitive Advantage
        </label>
        <textarea
          value={formData.competitiveAdvantage}
          onChange={(e) =>
            handleInputChange("competitiveAdvantage", e.target.value)
          }
          rows={3}
          placeholder="What makes your business unique?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Funding & Financial Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Funding Amount Needed *
        </label>
        <select
          value={formData.fundingAmount}
          onChange={(e) => handleInputChange("fundingAmount", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fundingAmount ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Amount</option>
          <option value="10k-50k">$10,000 - $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="100k-250k">$100,000 - $250,000</option>
          <option value="250k-500k">$250,000 - $500,000</option>
          <option value="500k-1m">$500,000 - $1,000,000</option>
          <option value="1m+">$1,000,000+</option>
        </select>
        {errors.fundingAmount && (
          <p className="text-red-500 text-sm mt-1">{errors.fundingAmount}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Funding Purpose *
        </label>
        <textarea
          value={formData.fundingPurpose}
          onChange={(e) => handleInputChange("fundingPurpose", e.target.value)}
          rows={3}
          placeholder="How will you use the funding?"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fundingPurpose ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fundingPurpose && (
          <p className="text-red-500 text-sm mt-1">{errors.fundingPurpose}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Annual Revenue
          </label>
          <select
            value={formData.currentRevenue}
            onChange={(e) =>
              handleInputChange("currentRevenue", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Revenue</option>
            <option value="0">$0 (Pre-revenue)</option>
            <option value="1k-10k">$1,000 - $10,000</option>
            <option value="10k-50k">$10,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k+">$500,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Projected Annual Revenue
          </label>
          <select
            value={formData.projectedRevenue}
            onChange={(e) =>
              handleInputChange("projectedRevenue", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Revenue</option>
            <option value="10k-50k">$10,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="1m+">$1,000,000+</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Size
          </label>
          <select
            value={formData.teamSize}
            onChange={(e) => handleInputChange("teamSize", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Size</option>
            <option value="1">1 (Solo founder)</option>
            <option value="2-5">2-5 employees</option>
            <option value="6-10">6-10 employees</option>
            <option value="11-25">11-25 employees</option>
            <option value="25+">25+ employees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Co-founders
          </label>
          <input
            type="number"
            min="0"
            value={formData.coFounders}
            onChange={(e) => handleInputChange("coFounders", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Legal & Compliance
      </h3>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="businessRegistered"
          checked={formData.businessRegistered}
          onChange={(e) =>
            handleInputChange("businessRegistered", e.target.checked)
          }
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="businessRegistered"
          className="text-sm font-medium text-gray-700"
        >
          Business is legally registered
        </label>
      </div>

      {formData.businessRegistered && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax ID / EIN
            </label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => handleInputChange("taxId", e.target.value)}
              placeholder="XX-XXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legal Structure
            </label>
            <select
              value={formData.legalStructure}
              onChange={(e) =>
                handleInputChange("legalStructure", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Structure</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="partnership">Partnership</option>
              <option value="sole-proprietorship">Sole Proprietorship</option>
              <option value="other">Other</option>
            </select>
          </div>
        </>
      )}

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">Terms & Conditions</h4>
        <p className="text-sm text-blue-800">
          By submitting this registration, you agree to our terms of service and
          privacy policy. You also confirm that all information provided is
          accurate and complete.
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
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
            className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Registration
          </button>
        )}
      </div>
    </form>
  );
}
