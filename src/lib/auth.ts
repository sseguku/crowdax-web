import api from "./api";
import { railsApi } from "./railsApi";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "entrepreneur" | "investor";
  created_at: string;
  updated_at: string;
  // Optional fields that might be present
  company_name?: string;
  phone_number?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: "entrepreneur" | "investor";
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "entrepreneur" | "investor";
  // Additional fields for entrepreneur
  companyName?: string;
  industry?: string;
  businessStage?: string;
  foundedDate?: string;
  website?: string;
  description?: string;
  problemSolved?: string;
  targetMarket?: string;
  competitiveAdvantage?: string;
  fundingAmount?: string;
  fundingPurpose?: string;
  currentRevenue?: string;
  projectedRevenue?: string;
  teamSize?: string;
  coFounders?: string;
  businessRegistered?: boolean;
  taxId?: string;
  legalStructure?: string;
  // Additional fields for investor
  jobTitle?: string;
  yearsOfExperience?: string;
  investmentAmount?: string;
  investmentFrequency?: string;
  preferredIndustries?: string[];
  investmentStage?: string[];
  annualIncome?: string;
  netWorth?: string;
  accreditedInvestor?: boolean;
  previousInvestments?: string;
  investmentGoals?: string;
  riskTolerance?: string;
  preferredGeographicRegions?: string[];
  minimumInvestment?: string;
  maximumInvestment?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string; // Rails JWT refresh token
  message?: string;
}

// Rails API specific response interfaces
export interface RailsAuthResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Utility to convert camelCase keys to snake_case recursively
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      acc[snakeKey] = toSnakeCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Authentication service
export const authService = {
  // Login user with Rails API
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Rails expects /users/sign_in with user object containing email and password
      const loginData = {
        user: {
          email: credentials.email,
          password: credentials.password,
        },
      };

      const response = await railsApi.post<RailsAuthResponse>(
        "/users/sign_in",
        loginData
      );

      // Extract data from Rails response format
      const { data } = response;
      const { user: railsUser, token } = data;

      // Map Rails user data to our User interface
      const user: User = {
        id: railsUser.id,
        email: railsUser.email,
        first_name: railsUser.first_name || railsUser.firstName || "",
        last_name: railsUser.last_name || railsUser.lastName || "",
        role: railsUser.role,
        created_at: railsUser.created_at || railsUser.createdAt,
        updated_at: railsUser.updated_at || railsUser.updatedAt,
        company_name: railsUser.company_name || railsUser.companyName,
        phone_number: railsUser.phone_number || railsUser.phone,
      };

      // Store tokens and user data
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token, message: response.status?.message };
    } catch (error: any) {
      console.error("Login error details:", error);
      throw new Error(error.message || "Login failed");
    }
  },

  // Register user with Rails API
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Convert camelCase fields to snake_case for Rails
      const snakeData = toSnakeCase(data);
      const response = await railsApi.post<RailsAuthResponse>("/users", {
        user: snakeData,
      });

      // Extract data from Rails response format
      const { data: responseData } = response;
      const { user, token } = responseData;

      // Store tokens and user data
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token, message: response.status?.message };
    } catch (error: any) {
      // Improved error handling for Rails validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("; ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Registration failed");
    }
  },

  // Logout user with Rails API
  async logout(): Promise<void> {
    try {
      // Call Rails logout endpoint if available
      await railsApi.post("/auth/logout", {});
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // Clear all stored data
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  },

  // Update user data
  updateUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Validate token with Rails API
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      await railsApi.get("/auth/validate", { token });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Refresh authentication token
  async refreshAuthToken(): Promise<string | null> {
    try {
      return await railsApi.refreshToken();
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  },

  // Get current user from Rails API
  async getCurrentUserFromApi(): Promise<User | null> {
    try {
      const response = await railsApi.get<User>("/auth/me");
      this.updateUser(response);
      return response;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },
};

export default authService;
