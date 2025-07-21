# API Integration Documentation

This document describes how the Next.js frontend connects to the API at `http://localhost:3000/`.

## Overview

The frontend is configured to communicate with the API using axios for HTTP requests. The integration includes:

- Authentication service for login/registration
- API client with interceptors for token management
- React context for state management
- Protected routes and role-based access

## API Configuration

### Base Configuration

- **API URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token in Authorization header

### API Client (`src/lib/api.ts`)

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Request Interceptors

- Automatically adds authentication token to requests
- Handles token retrieval from localStorage

### Response Interceptors

- Handles 401 unauthorized responses
- Automatically logs out user and redirects to login page

## Authentication Service (`src/lib/auth.ts`)

### Features

- User login with email, password, and role
- User registration with comprehensive form data
- Token management (storage and retrieval)
- User data management
- Logout functionality

### API Endpoints Used

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Data Structures

```typescript
interface LoginCredentials {
  email: string;
  password: string;
  role: "entrepreneur" | "investor";
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "entrepreneur" | "investor";
  // Additional fields based on role
}
```

## React Context (`src/contexts/AuthContext.tsx`)

### Features

- Global authentication state management
- User data persistence
- Loading states
- Automatic token validation

### Usage

```typescript
import { useAuth } from "@/contexts/AuthContext";

const { user, isAuthenticated, login, register, logout } = useAuth();
```

## Protected Routes

### Dashboard Pages

- `/dashboard/entrepreneur` - Entrepreneur dashboard (role-based access)
- `/dashboard/investor` - Investor dashboard (role-based access)
- `/dashboard` - Automatic redirect based on user role

### Route Protection

- Unauthenticated users are redirected to `/login`
- Users are redirected to appropriate dashboard based on their role
- Loading states during authentication checks

## Form Integration

### Login Form (`src/app/login/page.tsx`)

- Role selection (entrepreneur/investor)
- Email and password validation
- Error handling and loading states
- Automatic redirect to appropriate dashboard

### Registration Forms

- **EntrepreneurForm** (`src/components/forms/EntrepreneurForm.tsx`)
  - Multi-step form with validation
  - Business information collection
  - API integration for registration
- **InvestorForm** (`src/components/forms/InvestorForm.tsx`)
  - Multi-step form with validation
  - Investment preferences collection
  - API integration for registration

## Navigation Integration

### Dynamic Navigation (`src/components/Navigation.tsx`)

- Shows different content for authenticated/unauthenticated users
- Displays user name and logout option when logged in
- Role-based dashboard links

## Error Handling

### API Errors

- Network errors are caught and displayed to users
- 401 errors trigger automatic logout
- Form validation errors are displayed inline

### User Feedback

- Loading states during API calls
- Success/error messages
- Form validation feedback

## Local Storage

### Stored Data

- `authToken` - JWT token for API authentication
- `user` - Serialized user object with role and profile information

### Security

- Tokens are automatically included in API requests
- Automatic cleanup on logout or token expiration

## Development Setup

1. Ensure the API is running on `http://localhost:3000`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:3001` (or next available port)

## API Documentation

For detailed API documentation, visit: `http://localhost:3000/docs`

## Testing the Integration

1. **Registration**: Use the registration forms to create new accounts
2. **Login**: Test login with created accounts
3. **Dashboard Access**: Verify role-based dashboard access
4. **Logout**: Test logout functionality
5. **Token Persistence**: Refresh page to verify token persistence

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure API allows requests from frontend origin
2. **Authentication Failures**: Check token format and API endpoint
3. **Role-based Access**: Verify user role is correctly set during registration

### Debug Information

- Check browser console for API request/response logs
- Verify localStorage contains authToken and user data
- Check network tab for failed API requests
