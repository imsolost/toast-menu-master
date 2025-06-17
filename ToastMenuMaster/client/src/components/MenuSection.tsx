import { ToastMenuItem } from "@/lib/toastApi";
import { Button } from "@/components/ui/button";

interface MenuSectionProps {
  menuItems: ToastMenuItem[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToOrder: (item: ToastMenuItem) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";

const getAvailabilityBadge = (availability: string) => {
  switch (availability) {
    case 'available':
      return <span className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium">Available</span>;
    case 'low-stock':
      return <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">Low Stock</span>;
    case 'out-of-stock':
      return <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">Out of Stock</span>;
    default:
      return <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-medium">Unknown</span>;
  }
};

export default function MenuSection({ 
  menuItems, 
  selectedCategory, 
  onCategoryChange, 
  onAddToOrder, 
  isLoading, 
  error, 
  onRetry 
}: MenuSectionProps) {
  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <i className="fas fa-exclamation-triangle text-red-500 mr-2"></i>
            <h3 className="font-semibold text-red-500">Error Loading Menu</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <Button 
            onClick={onRetry}
            className="bg-red-500 hover:bg-red-700 text-white"
          >
            <i className="fas fa-redo mr-2"></i>Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Category Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Menu Categories</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onCategoryChange('all')}
          >
            All Items
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <i className="fas fa-utensils text-gray-300 text-3xl mb-3"></i>
          <p className="text-gray-500 text-sm">No menu items available</p>
          <p className="text-gray-400 text-xs">Items will appear here once loaded from Toast API</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const isOutOfStock = item.availability === 'out-of-stock';
            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${
                  isOutOfStock ? 'opacity-75' : ''
                }`}
              >
                <div className="relative">
                  <img 
                    src={item.imageUrl || DEFAULT_IMAGE_URL} 
                    alt={item.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE_URL;
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    {getAvailabilityBadge(item.availability)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${isOutOfStock ? 'text-gray-400' : 'text-slate-800'}`}>
                      {item.name}
                    </h3>
                    <span className={`text-lg font-bold ${isOutOfStock ? 'text-gray-400' : 'text-orange-500'}`}>
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${isOutOfStock ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                  <div className="flex items-center justify-end">
                    <Button
                      onClick={() => onAddToOrder(item)}
                      disabled={isOutOfStock}
                      className={`font-medium text-sm transition-colors ${
                        isOutOfStock 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      {isOutOfStock ? (
                        <>
                          <i className="fas fa-times mr-1"></i>Unavailable
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus mr-1"></i>Add to Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
