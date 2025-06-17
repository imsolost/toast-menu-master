import { Button } from "@/components/ui/button";
import { Order } from "@/lib/toastApi";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export default function OrderConfirmationModal({ isOpen, order, onClose }: OrderConfirmationModalProps) {
  if (!isOpen || !order) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">
            Order #{order.id} has been successfully submitted
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-slate-800 mb-2">Order Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Type:</span>
              <span className="capitalize">{order.orderType.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-semibold text-orange-500">${parseFloat(order.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Time:</span>
              <span>{order.estimatedTime} minutes</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handlePrintReceipt}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 font-medium"
          >
            <i className="fas fa-print mr-2"></i>Print Receipt
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 font-medium"
          >
            <i className="fas fa-times mr-2"></i>Close
          </Button>
        </div>
      </div>
    </div>
  );
}
