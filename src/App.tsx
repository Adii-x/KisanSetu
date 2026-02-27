import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { UserRoleProvider } from "@/context/UserRoleContext";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import VoiceAssistant from "@/components/VoiceAssistant";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import FarmerDashboard from "./pages/FarmerDashboard";
import NotFound from "./pages/NotFound";
import "@/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <UserRoleProvider>
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/community" element={<Community />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/select-role" element={<RoleSelection />} />
              <Route path="/dashboard" element={<FarmerDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Chatbot />
            <VoiceAssistant />
          </BrowserRouter>
        </UserRoleProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
