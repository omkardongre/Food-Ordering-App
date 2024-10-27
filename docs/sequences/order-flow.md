# Order Processing Flow

```mermaid
sequenceDiagram
    participant Customer
    participant Frontend
    participant Backend
    participant Restaurant
    participant Database

    Customer->>Frontend: Add Items to Cart
    Frontend->>Frontend: Update Cart State
    Customer->>Frontend: Click Checkout
    Frontend->>Frontend: Show Delivery Form
    Customer->>Frontend: Fill Delivery Details
    Frontend->>Backend: Submit Order
    Backend->>Database: Create Order (status: placed)
    Database-->>Backend: Order Created
    Backend->>Frontend: Return Order ID
    Frontend->>Frontend: Redirect to Payment

    Note over Frontend,Backend: Payment Flow Starts Here

    Backend->>Database: Update Order (status: paid)
    Database-->>Backend: Order Updated
    Backend-->>Restaurant: Notify New Order
    Restaurant->>Backend: Update Order Status
    Backend->>Database: Update Status (inProgress)
    
    Restaurant->>Backend: Mark Out for Delivery
    Backend->>Database: Update Status (outForDelivery)
    Database-->>Backend: Status Updated
    Backend-->>Frontend: Status Update
    Frontend-->>Customer: Show Updated Status

    Restaurant->>Backend: Mark as Delivered
    Backend->>Database: Update Status (delivered)
    Database-->>Backend: Status Updated
    Backend-->>Frontend: Final Status Update
    Frontend-->>Customer: Show Delivery Confirmation
```

## Process Description

1. **Order Creation**:
   - Customer adds items to cart
   - Provides delivery details
   - System creates initial order

2. **Payment Processing**:
   - Order marked as placed
   - Payment flow initiated
   - Order updated when payment successful

3. **Restaurant Processing**:
   - Restaurant receives order notification
   - Updates order status as processed
   - Marks order for delivery

4. **Delivery Tracking**:
   - Status updates throughout delivery process
   - Customer notified of status changes
   - Final confirmation upon delivery