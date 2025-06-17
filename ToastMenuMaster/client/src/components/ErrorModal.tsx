import { Button } from "@/components/ui/button";

interface ErrorModalProps {
  isOpen: boolean;
  error: {
    message: string;
    code?: string;
  } | null;
  onClose: () => void;
  onRetry?: () => void;
}

export default function ErrorModal({ isOpen, error, onClose, onRetry }: ErrorModalProps) {
  if (!isOpen || !error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">API Error</h2>
          <p className="text-gray-600">There was an issue communicating with the Toast API</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-500 mb-2">Error Details</h3>
          <p className="text-sm text-red-700">{error.message}</p>
          {error.code && (
            <p className="text-xs text-red-600 mt-2">Error Code: {error.code}</p>
          )}
        </div>

        <div className="flex space-x-3">
          {onRetry && (
            <Button
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="flex-1 bg-red-500 hover:bg-red-700 text-white py-2 font-medium"
            >
              <i className="fas fa-redo mr-2"></i>Retry
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 font-medium"
          >
            <i className="fas fa-times mr-2"></i>Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
