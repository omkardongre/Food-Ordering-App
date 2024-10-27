# Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Auth0
    participant Backend
    participant Database

    User->>Frontend: Click Login
    Frontend->>Auth0: Redirect to Auth0 Login
    Auth0-->>User: Display Login Form
    User->>Auth0: Enter Credentials
    Auth0->>Auth0: Validate Credentials
    Auth0-->>Frontend: Return Access Token
    Frontend->>Backend: Call /api/user with Token
    Backend->>Auth0: Verify Token
    Auth0-->>Backend: Token Valid
    Backend->>Database: Check if User Exists
    alt First Time User
        Backend->>Database: Create User Profile
    end
    Database-->>Backend: User Data
    Backend-->>Frontend: Return User Profile
    Frontend->>Frontend: Store Token & Update UI

    Note over Frontend,Backend: Subsequent API calls include Access Token
```

## Process Description

1. **Initial Login**:
   - User initiates login through the frontend application
   - Frontend redirects to Auth0's login page
   - User provides credentials on Auth0's secure form

2. **Token Generation**:
   - Auth0 validates credentials and generates access token
   - Token is returned to frontend application
   - Frontend stores token for subsequent API calls

3. **User Profile Creation/Retrieval**:
   - Frontend makes API call to backend with token
   - Backend verifies token with Auth0
   - If new user, creates profile in database
   - Returns user profile data to frontend

4. **Session Management**:
   - Frontend maintains token in memory
   - All subsequent API calls include token
   - Token expiration handled automatically