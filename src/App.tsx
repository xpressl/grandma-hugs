import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import TodayPage from "@/pages/TodayPage";
import PhotosPage from "@/pages/PhotosPage";
import MusicPage from "@/pages/MusicPage";
import PrayerPage from "@/pages/PrayerPage";
import AdminPage from "@/pages/AdminPage";
import FamilyTreePage from "@/pages/FamilyTreePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/prayer" element={<PrayerPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/tree" element={<FamilyTreePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
