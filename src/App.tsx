
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
=======
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
>>>>>>> 8d8e8fcd446a13c1ad5cb5133b16ccdd079fa901
import Accounts from "./pages/Accounts";
import Leads from "./pages/Leads";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import Inbox from "./pages/Inbox";
import Leads from "./pages/Leads";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignsList from "./pages/CampaignsList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
<<<<<<< HEAD
        <Routes>
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/campaign" element={<CreateCampaign />} />
          <Route path="/allcampaigns" element={<CampaignsList />} />
          {/* <Route path="/addleads" element={<Leads />} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
=======
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-slate-900">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/leads" element={<Leads />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
>>>>>>> 8d8e8fcd446a13c1ad5cb5133b16ccdd079fa901
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
