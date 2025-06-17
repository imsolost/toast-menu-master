import { useState } from "react";
import { ToastMenuItem } from "@/lib/toastApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderItem {
  menuItem: ToastMenuItem;
  quantity: number;
}

interface OrderPanelProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearOrder: () => void;
  onSubmitOrder: (customerInfo: CustomerInfo) => void;
  isSubmitting: boolean;
}

interface CustomerInfo {
  name: string;
  phone: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
}

export default function OrderPanel({ 
  orderItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearOrder, 
  onSubmitOrder, 
  isSubmitting 
}: OrderPanelProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<'dine-in' | 'takeout' | 'delivery'>('dine-in');

  const subtotal = orderItems.reduce((sum, item) => 
    sum + (parseFloat(item.menuItem.price) * item.quantity), 0
  );
  
  const taxRate = 0.085; // 8.5%
  const serviceFee = 2.50;
  const tax = subtotal * taxRate;
  const total = subtotal + tax + serviceFee;

  const handleSubmit = () => {
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    
    if (!customerPhone.trim()) {
      alert('Please enter customer phone number');
      return;
    }
    
    if (orderItems.length === 0) {
      alert('Please add items to the order');
      return;
    }

    onSubmitOrder({
      name: customerName,
      phone: customerPhone,
      orderType
    });
  };

  const incrementQuantity = (itemId: string, currentQuantity: number) => {
    onUpdateQuantity(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      onRemoveItem(itemId);
    } else {
      onUpdateQuantity(itemId, currentQuantity - 1);
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Current Order</h2>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClearOrder}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Information
          </label>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full"
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full"
            />
            <Select value={orderType} onValueChange={(value: 'dine-in' | 'takeout' | 'delivery') => setOrderType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dine-in">Dine In</SelectItem>
                <SelectItem value="takeout">Takeout</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Order Items</h3>
          
          {orderItems.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-shopping-cart text-gray-300 text-3xl mb-3"></i>
              <p className="text-gray-500 text-sm">No items in order yet</p>
              <p className="text-gray-400 text-xs">Add items from the menu to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orderItems.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{menuItem.name}</p>
                    <p className="text-xs text-gray-500">${parseFloat(menuItem.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-xs transition-colors"
                      onClick={() => decrementQuantity(menuItem.id, quantity)}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                    <button
                      className="w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center text-xs transition-colors"
                      onClick={() => incrementQuantity(menuItem.id, quantity)}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8.5%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-medium">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg text-orange-500">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isSubmitting ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Submitting order...</p>
            </div>
          ) : (
            <>
              <Button
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold"
                disabled={orderItems.length === 0}
              >
                <i className="fas fa-paper-plane mr-2"></i>Submit Order
              </Button>
              <Button
                variant="outline"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 font-medium"
              >
                <i className="fas fa-save mr-2"></i>Save as Draft
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
