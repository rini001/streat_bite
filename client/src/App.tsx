import { BrowserRouter, BrowserRouter as Router } from "react-router-dom"; // Add BrowserRouter import
import { Routes, Route } from "react-router-dom"; // Ensure you're using v6 Routes and Route
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import VendorDiscovery from "@/pages/VendorDiscovery";
import VendorDetail from "@/pages/VendorDetail";
import VendorRegistration from "@/pages/VendorRegistration";
import UserProfile from "@/pages/UserProfile";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "./hooks/useAuth";
import VendorDashboard from "./pages/VendorDashboard";

function App() {
  return (
    <BrowserRouter> {/* Add BrowserRouter around your app */}
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <AuthProvider>
              <Header />
            </AuthProvider>
            <main className="flex-grow">
              <Routes> {/* Use Routes and Route for routing */}
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<VendorDiscovery />} />
                <Route path="/vendor/:id" element={<VendorDetail />} />
                <Route path="/vendor-register" element={<VendorRegistration />} />
                <Route path="/profile" element={<UserProfile />} />
                {/* Commented out the Route for VendorDashboard, but adjust if needed */}
                <Route path="/dashboard/:id" element={<VendorDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
