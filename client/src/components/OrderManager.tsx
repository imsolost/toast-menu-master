import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastApi, ToastApiError } from "@/lib/toastApi";
import { useToast } from "@/hooks/use-toast";
import OrderConfirmationModal from "./OrderConfirmationModal";

interface OrderItem {
  menuItem: any;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
}

export function useOrderManager() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) => toastApi.createOrder(orderData),
    onSuccess: (order) => {
      setConfirmedOrder(order);
      setShowOrderConfirmation(true);
      setOrderItems([]);
      toast({
        title: "Order Confirmed",
        description: `Order #${order.id} has been successfully submitted.`,
      });
    },
    onError: (error: ToastApiError) => {
      throw error; // Let parent component handle error display
    }
  });

  const addToOrder = (menuItem: any) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setOrderItems(prev =>
      prev.map(item =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.menuItem.id !== itemId));
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  const submitOrder = (customerInfo: CustomerInfo) => {
    const subtotal = orderItems.reduce((sum, item) => {
      return sum + (parseFloat(item.menuItem.price) * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.08;
    const serviceFee = subtotal * 0.03;
    const total = subtotal + tax + serviceFee;

    const orderData = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      orderType: customerInfo.orderType,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      total: total.toFixed(2),
      items: orderItems.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price
      }))
    };

    createOrderMutation.mutate(orderData);
  };

  const OrderConfirmationComponent = () => (
    <OrderConfirmationModal
      isOpen={showOrderConfirmation}
      order={confirmedOrder}
      onClose={() => setShowOrderConfirmation(false)}
    />
  );

  return {
    orderItems,
    addToOrder,
    updateQuantity,
    removeItem,
    clearOrder,
    submitOrder,
    isSubmitting: createOrderMutation.isPending,
    OrderConfirmationComponent
  };
}