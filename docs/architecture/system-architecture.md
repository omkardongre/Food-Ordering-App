# System Architecture

## Overview
This document outlines the system architecture of the Food Ordering Application.

## System Components Diagram

```mermaid
flowchart TB
    subgraph Client
        Web["Web Application\n(React + TypeScript)"]
    end

    subgraph Server["Backend Server (Express + Node.js)"]
        API["REST API"]
        Auth["Auth Middleware"]
        Controllers["Business Logic"]
    end

    subgraph External["External Services"]
        Auth0["Auth0\nAuthentication"]
        Stripe["Stripe\nPayments"]
        Cloudinary["Cloudinary\nImage Storage"]
    end

    subgraph Database
        MongoDB[(MongoDB)]
    end

    Web -->|HTTP/REST| API
    API --> Auth
    Auth -->|Verify| Auth0
    Auth --> Controllers
    Controllers -->|Query| MongoDB
    Controllers -->|Payment| Stripe
    Controllers -->|Images| Cloudinary
```

## Component Description

### Frontend (React + TypeScript)
- User interface built with React and TypeScript
- State management using React Query
- UI components from Shadcn UI
- Authentication handled by Auth0

### Backend (Express + Node.js)
- RESTful API endpoints
- JWT-based authentication
- Business logic implementation
- External service integration

### External Services
- **Auth0**: User authentication and authorization
- **Stripe**: Payment processing
- **Cloudinary**: Image storage and management

### Database (MongoDB)
- Document-based data storage
- Mongoose ODM for data modeling
