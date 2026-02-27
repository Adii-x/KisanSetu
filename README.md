## 🌾 Kisan Setu

Empowering Farmers Through Digital Market Access Across India

## 📌 Overview

Kisan Setu is a digital platform designed to connect farmers directly with consumers and local markets across India. The platform aims to enhance transparency, improve price realization for farmers, and simplify the buying and selling of agricultural products using modern technology.

Kisan Setu enables seamless interaction between farmers and buyers while providing an admin panel to monitor transactions and ensure smooth platform operations. By leveraging digital tools such as real-time price updates, secure authentication, and order tracking, the system creates a reliable and efficient agricultural marketplace.

The multilingual feature helps both farmers and buyers easily navigate the platform in their preferred language. An AI chatbot assists users by guiding them through the website and answering queries, making the platform user-friendly and accessible.

The goal is not to replace existing supply chains, but to empower farmers with better market access, improved information flow, and stronger financial stability.

## ⚠️ Problem Statement

Despite being the backbone of the agricultural economy, farmers often face financial instability and income uncertainty. The losses experienced by farmers are not solely due to intermediaries, but arise from several structural and operational challenges such as:

→ Lack of real-time and transparent market price information

→ Limited bargaining power in price negotiations

→ Sudden price fluctuations and unpredictable demand

→ Post-harvest spoilage due to delayed sales

→ Payment delays and lack of secure transaction systems

→ Transportation and logistics constraints

Due to these issues, farmers are sometimes compelled to sell their produce at lower prices, resulting in reduced profits and financial stress.

There is a need for a digital, transparent, and accessible platform that empowers farmers with better market visibility, faster transactions, and direct communication with buyers — ultimately helping them achieve fair value for their produce.

🛠 Tech Stack
Component	Technology Used:-

Frontend:	JavaScript, React

Backend + Database: Supabase

Hosting: 	Vercel

Authentication:	JWT-based Login/Signup

## 🚀 Key Features

## 👨‍🌾 Farmer Features

→ Secure registration and KYC authentication

→ Upload product details (name, quantity, price, images, deals)

→ View real-time demand and incoming orders

→ Receive notifications for new buyer inquiries

## 🛒 Buyer Features

→ Login via email or phone number with OTP verification

→ Search crops/products by name or category

→ View available farmers and contact options

→ Place purchase requests directly to farmers

→ Make queries

→ Receive notifications when order status updates

## 🧑‍💼 Admin Panel

→ Manage users (farmers and buyers)

→ Approve or remove listings

→ View sales analytics and farmer performance

→ Handle user queries and monitor activity

## 🏗 System Architecture

Frontend (React Application)
↓
API Layer / Backend Services (Supabase)
↓
Database (Supabase Database)
↓
Authentication Layer (JWT-based Auth)
↓
Admin Monitoring & Analytics

The frontend communicates with Supabase services for authentication, data storage, and real-time updates. The admin panel accesses the same backend with role-based access control.

## ⚙️ Working Procedure

Kisan Setu operates through a simple and transparent process connecting farmers, buyers, and administrators on a single digital platform.

Step 1: User Registration and Login
Farmers and buyers register securely and log in to access their dashboards. Admin oversees user verification and platform activity.

Step 2: Product Listing by Farmers
Farmers upload product details including name, quantity, price, and images. Listings become visible to buyers (after approval if moderation is enabled).

Step 3: Product Search by Buyers
Buyers browse or search products by category or name, compare listings, and select suitable farmers.

Step 4: Order Placement
Buyers send purchase requests directly to farmers. Farmers receive real-time notifications.

Step 5: Order Confirmation
Farmers review and accept requests. Once accepted, order status is updated.

Step 6: Payment Process
(Future Scope)

Step 7: Delivery and Completion
(Future Scope)

Step 8: Admin Monitoring
Admin monitors users, listings, transactions, resolves disputes, and generates analytics reports.

Overall, the platform ensures transparency, faster communication, and better price realization for farmers.

## 🔄 Application Flow

Farmer → Add Product → View Requests → Accept Order

Buyer → Search Crop → Send Request → Receive Confirmation

Admin → Monitor Users → Approve Listings → Generate Reports

## ⚡ Setup Instructions

Clone the repository
git clone https://github.com/Adii-x/KisanSetu

Navigate to project directory
cd kisan-setu

Install dependencies
npm install

Configure environment variables
Create a .env file and add your Supabase keys

Run the development server
npm start

## 🚀 Deployment Details

The application is deployed using:

Frontend Hosting: Vercel

Backend & Database: Supabase

Authentication: JWT-based secure authentication

To deploy:

Push code to GitHub

Connect repository to Vercel

Add environment variables

Deploy

## 🔮 Future Enhancements

Payment integration with Razorpay

Delivery and logistics collaboration

Advanced AI chatbot features

Offline mode for low internet connectivity areas

Integration with government market price APIs

Real-time demand prediction using AI

## 🌱 Vision

To create a transparent, inclusive, and technology-driven agricultural marketplace that empowers farmers and strengthens India's agricultural ecosystem.


