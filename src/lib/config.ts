// Configuration utility for environment variables
export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    timeout: 10000, // 10 seconds
  },

  // Authentication Configuration
  auth: {
    tokenKey: "authToken",
    refreshTokenKey: "refreshToken",
    userKey: "user",
  },

  // App Configuration
  app: {
    name: "Crowdax",
    version: "1.0.0",
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  const baseURL = config.api.baseURL.replace(/\/$/, ""); // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ""); // Remove leading slash
  return `${baseURL}/${cleanEndpoint}`;
};

// Helper function to validate environment variables
export const validateConfig = (): void => {
  const requiredVars = ["NEXT_PUBLIC_API_BASE_URL"];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0 && config.isDevelopment) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`);
    console.warn("Using default values. Please check your .env.local file.");
  }
};

// Validate configuration on import
if (typeof window !== "undefined") {
  validateConfig();
}
