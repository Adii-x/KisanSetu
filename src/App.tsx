import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { UserRoleProvider } from "@/context/UserRoleContext";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import FarmerLayout from "@/layouts/FarmerLayout";
import BuyerLayout from "@/layouts/BuyerLayout";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";
import FarmerDashboardPage from "./pages/farmer/FarmerDashboardPage";
import BuyerDashboardPage from "./pages/buyer/BuyerDashboardPage";
import BuyerMarketplacePage from "./pages/buyer/BuyerMarketplacePage";
import BuyerOrdersPage from "./pages/buyer/BuyerOrdersPage";
import CartPage from "./pages/buyer/CartPage";

import BuyerSettingsPage from "./pages/buyer/BuyerSettingsPage";
import FarmerProductsPage from "./pages/farmer/FarmerProductsPage";
import FarmerOrdersPage from "./pages/farmer/FarmerOrdersPage";
import FarmerAnalyticsPage from "./pages/farmer/FarmerAnalyticsPage";
import FarmerCommunityPage from "./pages/farmer/FarmerCommunityPage";
import FarmerSettingsPage from "./pages/farmer/FarmerSettingsPage";
import "@/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <UserRoleProvider>
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/community" element={<Community />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/select-role" element={<RoleSelection />} />
              <Route path="/farmer" element={<FarmerLayout />}>
                <Route path="dashboard" element={<FarmerDashboardPage />} />
                <Route path="products" element={<FarmerProductsPage />} />
                <Route path="orders" element={<FarmerOrdersPage />} />
                <Route path="analytics" element={<FarmerAnalyticsPage />} />
                <Route path="community" element={<FarmerCommunityPage />} />
                <Route path="settings" element={<FarmerSettingsPage />} />
                <Route index element={<Navigate to="/farmer/dashboard" replace />} />
              </Route>
              <Route path="/farmer-dashboard" element={<Navigate to="/farmer/dashboard" replace />} />
              <Route path="/dashboard" element={<Navigate to="/farmer/dashboard" replace />} />
              <Route path="/buyer" element={<BuyerLayout />}>
                <Route path="dashboard" element={<BuyerDashboardPage />} />
                <Route path="marketplace" element={<BuyerMarketplacePage />} />
                <Route path="orders" element={<BuyerOrdersPage />} />
                <Route path="cart" element={<CartPage />} />

                <Route path="settings" element={<BuyerSettingsPage />} />
                <Route index element={<Navigate to="/buyer/dashboard" replace />} />
              </Route>
              <Route path="/buyer-dashboard" element={<Navigate to="/buyer/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Chatbot />
          </BrowserRouter>
        </UserRoleProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
