import api from "./api";
import { config } from "./config";

// Rails API specific configurations and utilities
export class RailsApiService {
  private static instance: RailsApiService;
  private baseURL: string;

  private constructor() {
    this.baseURL = config.api.baseURL;
  }

  public static getInstance(): RailsApiService {
    if (!RailsApiService.instance) {
      RailsApiService.instance = new RailsApiService();
    }
    return RailsApiService.instance;
  }

  // Generic GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleRailsError(error);
    }
  }

  // Generic POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleRailsError(error);
    }
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleRailsError(error);
    }
  }

  // Generic PATCH request
  async patch<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await api.patch(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleRailsError(error);
    }
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error: any) {
      throw this.handleRailsError(error);
    }
  }

  // Handle Rails-specific error responses
  private handleRailsError(error: any): Error {
    if (error.response?.data) {
      const railsError = error.response.data;

      // Handle Rails validation errors (422)
      if (error.response.status === 422 && railsError.errors) {
        const errorMessages = Object.entries(railsError.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("; ");
        return new Error(errorMessages);
      }

      // Handle Rails error messages
      if (railsError.error) {
        return new Error(railsError.error);
      }

      if (railsError.message) {
        return new Error(railsError.message);
      }

      // Handle Rails flash messages
      if (railsError.flash) {
        return new Error(
          railsError.flash.error ||
            railsError.flash.alert ||
            "An error occurred"
        );
      }
    }

    // Fallback error handling
    return new Error(error.message || "An unexpected error occurred");
  }

  // Upload file with Rails multipart form data
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      throw this.handleRailsError(error);
    }
  }

  // Get CSRF token from Rails
  async getCsrfToken(): Promise<string | null> {
    try {
      const response = await api.get("/csrf_token");
      return response.data.csrf_token;
    } catch (error) {
      console.warn("Could not fetch CSRF token:", error);
      return null;
    }
  }

  // Refresh authentication token (if using JWT refresh tokens)
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const { token } = response.data;
      localStorage.setItem("authToken", token);

      return token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear tokens and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    }
  }
}

// Export singleton instance
export const railsApi = RailsApiService.getInstance();
