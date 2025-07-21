# Rails API Integration with Next.js

This document provides a comprehensive guide for connecting your Rails API with the Next.js frontend using proper Authorization headers and Rails-specific configurations.

## Overview

The integration includes:

- **Axios-based API client** with Rails-specific configurations
- **Rails API service** with error handling for Rails conventions
- **Authentication service** with JWT token management
- **CSRF token support** for Rails security
- **File upload support** with multipart form data
- **Token refresh mechanism** for JWT authentication

## CORS Configuration (IMPORTANT)

If you're getting CORS errors, update your Rails `config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0k::Cors do
  allow do
    origins http://localhost:3000', http://localhost:3000 # Add your frontend URLs

    resource *',
      headers: :any,
      methods: :get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: Authorization] end
end
```

Make sure the `rack-cors` gem is in your `Gemfile`:

```ruby
gemrack-cors'
```

Then restart your Rails server after making these changes.

## Rails API Configuration

### Required Rails Gems

Add these gems to your Rails `Gemfile`:

```ruby
# Authentication
gem 'devise'
gem 'devise-jwt'
gem 'jwt'

# CORS support
gem 'rack-cors'

# API documentation
gem 'rswag-api'
gem 'rswag-ui'

# Serialization
gem 'active_model_serializers'
```

### CORS Configuration

In `config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001', 'http://localhost:3000' # Add your frontend URLs

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization']
  end
end
```

### JWT Configuration

In `config/initializers/devise.rb`:

```ruby
config.jwt do |jwt|
  jwt.secret = Rails.application.credentials.secret_key_base
  jwt.dispatch_requests = [
    ['POST', %r{^/auth/sign_in$}]
  ]
  jwt.revocation_requests = [
    ['DELETE', %r{^/auth/sign_out$}]
  ]
  jwt.expiration_time = 30.minutes.to_i
end
```

## Frontend Configuration

### API Client (`src/lib/api.ts`)

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for Rails session cookies
});

// Request interceptor for Rails API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token if needed
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for Rails errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### Rails API Service (`src/lib/railsApi.ts`)

The Rails API service provides:

- Generic CRUD operations
- Rails-specific error handling
- File upload support
- CSRF token management
- Token refresh functionality

## Authentication Flow

### 1. User Registration

```typescript
// Frontend registration
const registerData = {
  email: "user@example.com",
  password: "password123",
  password_confirmation: "password123",
  first_name: "John",
  last_name: "Doe",
  role: "entrepreneur",
  // Additional fields based on role
};

const response = await authService.register(registerData);
```

**Rails Controller Example:**

```ruby
class AuthController < ApplicationController
  def register
    user = User.new(user_params)

    if user.save
      token = user.generate_jwt
      render json: {
        user: user.as_json(only: [:id, :email, :first_name, :last_name, :role]),
        token: token,
        message: 'Registration successful'
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation,
                                :first_name, :last_name, :role, :phone)
  end
end
```

### 2. User Login

```typescript
// Frontend login
const credentials = {
  email: "user@example.com",
  password: "password123",
  role: "entrepreneur",
};

const response = await authService.login(credentials);
```

**Rails Controller Example:**

```ruby
class AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])

    if user&.valid_password?(params[:password])
      token = user.generate_jwt
      render json: {
        user: user.as_json(only: [:id, :email, :first_name, :last_name, :role]),
        token: token,
        message: 'Login successful'
      }
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end
end
```

### 3. Protected Routes

```typescript
// Frontend protected route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};
```

**Rails Controller Example:**

```ruby
class Api::V1::BaseController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    @current_user = User.find_by_jwt_token(token)

    unless @current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
```

## Error Handling

### Rails Validation Errors (422)

```typescript
// Frontend error handling
try {
  await authService.register(data);
} catch (error) {
  // Rails validation errors are automatically parsed
  console.error(error.message); // "email: has already been taken; password: is too short"
}
```

### Network Errors

```typescript
// Handle network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      throw new Error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);
```

## File Uploads

### Frontend File Upload

```typescript
// Upload file to Rails API
const uploadFile = async (file: File) => {
  try {
    const response = await railsApi.uploadFile("/api/v1/uploads", file, {
      description: "Document upload",
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
```

### Rails File Upload Controller

```ruby
class Api::V1::UploadsController < ApplicationController
  def create
    upload = current_user.uploads.build(upload_params)

    if upload.save
      render json: {
        id: upload.id,
        url: upload.file.url,
        filename: upload.file.filename
      }
    else
      render json: { errors: upload.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def upload_params
    params.require(:upload).permit(:file, :description)
  end
end
```

## Token Management

### Token Refresh

```typescript
// Automatic token refresh
const refreshToken = async () => {
  try {
    const newToken = await authService.refreshAuthToken();
    if (newToken) {
      // Token refreshed successfully
      return newToken;
    }
  } catch (error) {
    // Redirect to login
    authService.logout();
  }
};
```

### Token Validation

```typescript
// Validate token on app startup
useEffect(() => {
  const validateToken = async () => {
    const isValid = await authService.validateToken();
    if (!isValid) {
      authService.logout();
    }
  };

  if (authService.isAuthenticated()) {
    validateToken();
  }
}, []);
```

## API Endpoints Structure

### Recommended Rails Routes

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentication
      post '/auth/register', to: 'auth#register'
      post '/auth/login', to: 'auth#login'
      delete '/auth/logout', to: 'auth#logout'
      get '/auth/me', to: 'auth#me'
      post '/auth/refresh', to: 'auth#refresh'

      # User management
      resources :users, only: [:show, :update]

      # Campaigns (for entrepreneurs)
      resources :campaigns

      # Investments (for investors)
      resources :investments

      # File uploads
      resources :uploads, only: [:create, :destroy]
    end
  end
end
```

## Testing the Integration

### 1. Start Rails API

```bash
# In your Rails project directory
rails server -p 3000
```

### 2. Start Next.js Frontend

```bash
# In your Next.js project directory
npm run dev
```

### 3. Test Authentication

```bash
# Test registration
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "email": "test@example.com",
      "password": "password123",
      "password_confirmation": "password123",
      "first_name": "Test",
      "last_name": "User",
      "role": "entrepreneur"
    }
  }'

# Test login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure `rack-cors` is properly configured
   - Check that frontend origin is allowed

2. **JWT Token Issues**

   - Verify JWT secret is properly set
   - Check token expiration settings

3. **CSRF Token Errors**

   - Disable CSRF for API controllers: `skip_before_action :verify_authenticity_token`
   - Or include CSRF token in requests

4. **Authentication Failures**
   - Check token format in Authorization header
   - Verify user authentication logic in Rails

### Debug Information

- Check Rails server logs for API requests
- Use browser Network tab to inspect requests/responses
- Verify localStorage contains correct tokens
- Check Rails console for user authentication status

## Security Considerations

1. **HTTPS in Production**

   - Always use HTTPS in production
   - Configure secure cookie settings

2. **Token Security**

   - Use short-lived access tokens
   - Implement proper token refresh
   - Store refresh tokens securely

3. **Input Validation**

   - Validate all inputs on both frontend and backend
   - Use strong parameters in Rails controllers

4. **Rate Limiting**
   - Implement rate limiting for authentication endpoints
   - Use Rails rack-attack gem for protection
