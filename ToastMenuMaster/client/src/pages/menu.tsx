import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toastApi, ToastApiError } from "@/lib/toastApi";
import Header from "@/components/Header";
import MenuSection from "@/components/MenuSection";
import OrderPanel from "@/components/OrderPanel";
import { useOrderManager } from "@/components/OrderManager";
import { useErrorHandler } from "@/components/ErrorHandler";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("menu");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Use new modular components
  const orderManager = useOrderManager();
  const errorHandler = useErrorHandler();

  // Fetch menu items with caching
  const { 
    data: menuItems = [], 
    isLoading, 
    error: menuError, 
    refetch: refetchMenu 
  } = useQuery({
    queryKey: ['/api/menu'],
    queryFn: () => toastApi.getMenuItems(),
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000 // Keep in cache for 10 minutes (renamed from cacheTime in v5)
  });

  // Error handling
  const handleError = (error: ToastApiError) => {
    errorHandler.showError({
      message: error.message,
      code: error.code
    });
  };

  // Handle menu errors
  if (menuError) {
    handleError(menuError as ToastApiError);
  }

  // Order submission with error handling
  const handleSubmitOrder = (customerInfo: any) => {
    try {
      orderManager.submitOrder(customerInfo);
    } catch (error) {
      handleError(error as ToastApiError);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <MenuSection
              menuItems={menuItems}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onAddToOrder={orderManager.addToOrder}
              isLoading={isLoading}
              error={menuError?.message || null}
              onRetry={refetchMenu}
            />
          </div>

          {/* Order Panel */}
          <div className="lg:col-span-1">
            <OrderPanel
              orderItems={orderManager.orderItems}
              onUpdateQuantity={orderManager.updateQuantity}
              onRemoveItem={orderManager.removeItem}
              onClearOrder={orderManager.clearOrder}
              onSubmitOrder={handleSubmitOrder}
              isSubmitting={orderManager.isSubmitting}
            />
          </div>
        </div>
      </main>

      {/* Modular Components */}
      <orderManager.OrderConfirmationComponent />
      <errorHandler.ErrorModalComponent />
    </div>
  );
}