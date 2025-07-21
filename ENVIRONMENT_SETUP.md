# Environment Setup

This document explains how to configure the environment variables for the Crowdax application.

## Environment Variables

### Required Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000
```

### Variable Descriptions

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for your Rails API (accessible from the browser)
- `API_BASE_URL`: The base URL for your Rails API (server-side only)

## Configuration

The application uses a centralized configuration system located in `src/lib/config.ts`:

```typescript
import { config } from "@/lib/config";

// Access API base URL
console.log(config.api.baseURL);

// Check environment
console.log(config.isDevelopment); // true in development
console.log(config.isProduction); // true in production
```

## API Integration

The application is configured to work with a Rails API running on `localhost:3000`. The API endpoints expected are:

### Authentication Endpoints

- `POST /users/sign_in` - User login
- `POST /users` - User registration
- `DELETE /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Expected Request Format

**Login:**

```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Register:**

```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "entrepreneur"
  }
}
```

## Development vs Production

- **Development**: Uses `http://localhost:3000` as default
- **Production**: Should be set to your production API URL

## Troubleshooting

1. **Environment variables not loading**: Restart your development server
2. **API connection issues**: Check that your Rails server is running on the correct port
3. **CORS errors**: Ensure your Rails API has CORS properly configured

## Rails API Setup

Make sure your Rails API has the following gems in your `Gemfile`:

```ruby
gem 'rack-cors'
gem 'devise'
gem 'devise-jwt'
```

And configure CORS in `config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001', 'http://localhost:3003' # Your Next.js ports

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization']
  end
end
```
