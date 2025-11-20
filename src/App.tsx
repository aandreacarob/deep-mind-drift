import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MuseumEntrance from "./pages/MuseumEntrance";
import Seccion1 from "./pages/Seccion1";
import Seccion2 from "./pages/Seccion2";
import Seccion3 from "./pages/Seccion3";
import QueueViewer from "./pages/QueueViewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MuseumEntrance />} />
          <Route path="/seccion-1" element={<Seccion1 />} />
          <Route path="/seccion-2" element={<Seccion2 />} />
          <Route path="/seccion-3" element={<Seccion3 />} />
          <Route path="/queue-viewer" element={<QueueViewer />} />
          <Route path="/original" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
