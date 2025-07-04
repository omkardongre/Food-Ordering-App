# Food Ordering Application

A full-stack food ordering platform built with React, Express, and MongoDB. This application allows users to browse restaurants, place orders, and enables restaurant owners to manage their menus and orders.

## 🚀 Features

- **User Authentication**: Secure login/signup via Auth0
- **User Profile Management**: Users can update their delivery details
- **Restaurant Management**:
  - Restaurant owners can create and manage their restaurant profile
  - Upload menu items with images via Cloudinary
  - Manage incoming orders
- **Search & Filters**:
  - Search restaurants by name/location
  - Filter by cuisine types
  - Sort options (rating, delivery time, etc.)
- **Order Management**:
  - Real-time order status updates
  - Order history for customers
  - Restaurant order dashboard
- **Shopping Cart**: Add/remove items, checkout functionality
- **Payment Integration**: Secure payments via Stripe
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technologies Used

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - React Query
  - Auth0 Authentication

- **Backend**:
  - Node.js with Express
  - MongoDB with Mongoose
  - TypeScript
  - JWT Authentication

- **Other Services**:
  - Cloudinary (Image Upload)
  - Stripe (Payments)
  - Auth0 (Authentication)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe CLI (for local payment testing)
- NPM or Yarn

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/food-ordering-app.git
   cd food-ordering-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file and add your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create .env file and add your environment variables
   npm run dev
   ```

4. **Stripe Webhook Setup (for payment testing)**
   ```bash
   stripe listen --forward-to localhost:7000/api/order/checkout/webhook
   ```


## 🔑 Auth0 Setup

1. Create an Auth0 account and application
2. Configure the following Auth0 settings:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
3. Add Auth0 environment variables to both frontend and backend

## 💳 Stripe Setup

1. Create a Stripe account
2. Install Stripe CLI for local testing
3. Add Stripe environment variables
4. Configure webhook endpoints

## 🌟 Production Deployment

- Backend: Deploy to services like Render, Heroku, or AWS
- Frontend: Deploy to services like Vercel, Netlify, or GitHub Pages
- Update environment variables in production
- Configure CORS and security settings

## 🤝 Contributing

Feel free to open issues and pull requests!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Auth0 for authentication
- Stripe for payment processing
- Cloudinary for image management
- Shadcn UI for components