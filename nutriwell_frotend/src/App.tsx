import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
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
import Checkout from "./pages/Checkout.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminProductEditor from "./pages/admin/AdminProductEditor.tsx";
import AdminFilters from "./pages/admin/AdminFilters.tsx";
import AdminRecipes from "./pages/admin/AdminRecipes.tsx";
import AdminRecipeEditor from "./pages/admin/AdminRecipeEditor.tsx";
import AdminContactReports from "./pages/admin/AdminContactReports.tsx";
import AdminContentEditor from "./pages/admin/AdminContentEditor.tsx";
import AdminLocationStore from "./pages/admin/AdminLocationStore.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
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
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartDrawer />
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:reference" element={<OrderConfirmation />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductEditor />} />
              <Route path="/admin/products/:id/edit" element={<AdminProductEditor />} />
              <Route path="/admin/filters" element={<AdminFilters />} />
              <Route path="/admin/recipes" element={<AdminRecipes />} />
              <Route path="/admin/recipes/new" element={<AdminRecipeEditor />} />
              <Route path="/admin/recipes/:id/edit" element={<AdminRecipeEditor />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/contact-reports" element={<AdminContactReports />} />
              <Route path="/admin/content" element={<AdminContentEditor />} />
              <Route path="/admin/location" element={<AdminLocationStore />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
