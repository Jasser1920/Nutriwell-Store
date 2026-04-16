import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Products from "./pages/Products.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import About from "./pages/About.tsx";
import Conseils from "./pages/Conseils.tsx";
import Recipes from "./pages/Recipes.tsx";
import RecipeDetail from "./pages/RecipeDetail.tsx";
import StoreLocator from "./pages/StoreLocator.tsx";
import Contact from "./pages/Contact.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminProductEditor from "./pages/admin/AdminProductEditor.tsx";
import AdminRecipes from "./pages/admin/AdminRecipes.tsx";
import AdminRecipeEditor from "./pages/admin/AdminRecipeEditor.tsx";
import AdminContactReports from "./pages/admin/AdminContactReports.tsx";
import AdminContentEditor from "./pages/admin/AdminContentEditor.tsx";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/conseils" element={<Conseils />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:slug" element={<RecipeDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/store-locator" element={<StoreLocator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AdminProductEditor />} />
            <Route path="/admin/products/:id/edit" element={<AdminProductEditor />} />
            <Route path="/admin/recipes" element={<AdminRecipes />} />
            <Route path="/admin/recipes/new" element={<AdminRecipeEditor />} />
            <Route path="/admin/recipes/:id/edit" element={<AdminRecipeEditor />} />
            <Route path="/admin/contact-reports" element={<AdminContactReports />} />
            <Route path="/admin/content" element={<AdminContentEditor />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
