"use client";

import { useState } from "react";
import { railsApi } from "@/lib/railsApi";
import { authService } from "@/lib/auth";

export default function ApiTest() {
  const [status, setStatus] = useState<string>("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setStatus("Testing API connection...");

    try {
      // Test basic API connection
      const result = await railsApi.get("/api/v1/health");
      setResponse(result);
      setStatus("✅ API connection successful");
    } catch (error: any) {
      setStatus(`❌ API connection failed: ${error.message}`);
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const testAuthEndpoints = async () => {
    setLoading(true);
    setStatus("Testing authentication endpoints...");

    try {
      // Test registration endpoint
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: "password123",
        password_confirmation: "password123",
        first_name: "Test",
        last_name: "User",
        role: "entrepreneur",
        phone: "+1234567890",
      };

      const registerResult = await railsApi.post("/api/v1/auth/register", {
        user: testUser,
      });
      setResponse(registerResult);
      setStatus("✅ Registration endpoint working");

      // Test login with created user
      const loginResult = await railsApi.post("/api/v1/auth/login", {
        email: testUser.email,
        password: testUser.password,
      });

      setResponse({ register: registerResult, login: loginResult });
      setStatus("✅ Authentication endpoints working");
    } catch (error: any) {
      setStatus(`❌ Authentication test failed: ${error.message}`);
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const testProtectedEndpoint = async () => {
    setLoading(true);
    setStatus("Testing protected endpoint...");

    try {
      const token = authService.getToken();
      if (!token) {
        setStatus("❌ No authentication token found");
        return;
      }

      const result = await railsApi.get("/api/v1/auth/me");
      setResponse(result);
      setStatus("✅ Protected endpoint working");
    } catch (error: any) {
      setStatus(`❌ Protected endpoint failed: ${error.message}`);
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setStatus("");
    setResponse(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Rails API Connection Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testApiConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test API Connection
        </button>

        <button
          onClick={testAuthEndpoints}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Auth Endpoints
        </button>

        <button
          onClick={testProtectedEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test Protected Endpoint
        </button>
      </div>

      {status && (
        <div
          className={`p-4 rounded mb-4 ${
            status.includes("✅")
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <p className="font-medium">{status}</p>
        </div>
      )}

      {response && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Response:</h3>
            <button
              onClick={clearResults}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">API Configuration:</h3>
        <ul className="text-sm space-y-1">
          <li>
            • Base URL:{" "}
            <code className="bg-gray-200 px-1 rounded">
              http://localhost:3000
            </code>
          </li>
          <li>
            • Content-Type:{" "}
            <code className="bg-gray-200 px-1 rounded">application/json</code>
          </li>
          <li>
            • Accept:{" "}
            <code className="bg-gray-200 px-1 rounded">application/json</code>
          </li>
          <li>
            • Authorization:{" "}
            <code className="bg-gray-200 px-1 rounded">
              Bearer &lt;token&gt;
            </code>
          </li>
        </ul>
      </div>
    </div>
  );
}
