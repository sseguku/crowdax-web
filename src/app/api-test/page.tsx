import ApiTest from "@/components/ApiTest";

export default function ApiTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Rails API Integration Test
          </h1>
          <p className="text-gray-600 mt-2">
            Test the connection between Next.js frontend and Rails API
          </p>
        </div>

        <ApiTest />

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Expected Rails API Endpoints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Authentication</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• POST /api/v1/auth/register</li>
                <li>• POST /api/v1/auth/login</li>
                <li>• DELETE /api/v1/auth/logout</li>
                <li>• GET /api/v1/auth/me</li>
                <li>• POST /api/v1/auth/refresh</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Health Check</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GET /api/v1/health</li>
                <li>• GET /csrf_token</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
