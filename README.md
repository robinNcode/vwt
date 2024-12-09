# Volt Wave Tech : Online Platform for Electrical and Electronics Accessories

### Project Description
Volt Wave Tech's online platform will serve as an interactive website for showcasing and selling electrical and electronics accessories while offering service bookings. It will have a Single Page Application (SPA) design for the public interface, along with an admin panel to manage content and operations efficiently.

The platform will focus on:

    Ease of navigation for customers to browse accessories and services.
    Seamless order placement for both products and services.
    Real-time order tracking for customers.
    Administrative tools to manage accessories, services, and orders.

### Features

- Public Pages (Customer-Facing)
    Home:
        Overview of Volt Wave Tech.
        Highlighted accessories and services.
        Promotions or featured items.

    Accessories:
        List of available accessories with details (name, price, description, image).
        Search and filter functionality.

    Services:
        List of available services with descriptions.
        Pricing details (if applicable).

    Contact:
        Contact form for customer inquiries.
        Volt Wave Tech's location and contact details.

    Cart:
        Add accessories and services to the cart.
        Display total cost.
        Proceed to checkout.

    Order Tracking:
        Enter order ID to track status.

- Admin Panel

    Manage Accessories:
        Add, update, delete, and view accessory details.

    Manage Services:
        Add, update, delete, and view service details.

    Manage Orders:
        View and update the status of orders (e.g., Pending, Processing, Completed).

    Dashboard:
        Overview of orders, sales, and inventory statistics.

### Functional Requirements
- Public User
    View products and services.
    Search for accessories using filters (e.g., category, price range).
    Add items to the cart and checkout.
    Track order status using an order ID.
    Submit inquiries through the contact form.

- Admin
    CRUD operations for accessories and services.
    Update order status.
    View a summary of sales and order details.

- System
    Authenticate users for the admin panel.
    Handle secure payments during checkout (optional integration with Stripe/PayPal).
    Send order confirmation and status updates via email.

### API Endpoints
 - Authentication

    |Method|Endpoint|Description|
    |---|---|---|
    |POST|/api/auth/login|Admin login|
    |POST|/api/auth/logout|Admin logout|

 - Accessories

     |Method |	Endpoint | Description|
     |---|---|---|
     |GET	|/api/accessories|	Get all accessories|
     |POST	|/api/accessories|	Add a new accessory|
     |PUT	|/api/accessories/:id|	Update an accessory|
     |DELETE	|/api/accessories/:id|	Delete an accessory|

- Services

     |Method	|Endpoint	|Description|
     |---|---|---|
     |GET	|/api/services	|Get all services|
     |POST	|/api/services	|Add a new service|
     |PUT	|/api/services/:id	|Update a service|
     |DELETE	|/api/services/:id	|Delete a service|

- Orders
    
    |Method	|Endpoint	|Description|
    |---|---|---|
    |GET	|/api/orders	|Get all orders|
    |POST	|/api/orders	|Place a new order|
    |PUT	|/api/orders/:id	|Update an order status|
    |GET	|/api/orders/:id	|Get order by ID|

- Order Tracking

    |Method	|Endpoint	|Description|
    |---|---|---|
    |GET	|/api/orders/track/:id	|Track order status by ID|

- Contact Messages
    
    |Method	|Endpoint	|Description|
    |---|---|---|
    |GET	|/api/messages	|Get all contact messages|
    |POST	|/api/messages	|Submit a new contact message|


### Tech Stack
- Frontend
    - React.js
    - Redux (State Management)
    - React Router (Navigation)
    - Axios (HTTP Requests)
    - Bootstrap (Styling)

- Backend
    - Node.js
    - Express.js
    - MongoDB (Database)
    - Mongoose (ODM)
    - JWT (Authentication)
    - Nodemailer (Email Notifications)


### Developer
- [MsM Robin] (https://github.com/robinncode/)


### License
This project is licensed under the MIT License - see the `LICENSE` file for details.
