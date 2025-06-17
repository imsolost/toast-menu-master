import { useState } from "react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [notificationCount] = useState(3);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-utensils text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Bella Vista Restaurant</h1>
              <p className="text-xs text-gray-500">Downtown Location</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <button 
              className={`font-medium pb-2 transition-colors ${
                activeTab === 'menu' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
              onClick={() => onTabChange('menu')}
            >
              <i className="fas fa-list-ul mr-2"></i>Menu
            </button>
            <button 
              className={`font-medium pb-2 transition-colors ${
                activeTab === 'orders' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
              onClick={() => onTabChange('orders')}
            >
              <i className="fas fa-shopping-cart mr-2"></i>Orders
            </button>
            <button 
              className={`font-medium pb-2 transition-colors ${
                activeTab === 'analytics' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
              onClick={() => onTabChange('analytics')}
            >
              <i className="fas fa-chart-line mr-2"></i>Analytics
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <i className="fas fa-bell text-gray-600"></i>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="flex space-x-1 p-2">
          <button 
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'menu'
                ? 'text-orange-500 bg-orange-100'
                : 'text-gray-600 hover:text-orange-500'
            }`}
            onClick={() => onTabChange('menu')}
          >
            <i className="fas fa-list-ul mr-2"></i>Menu
          </button>
          <button 
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'orders'
                ? 'text-orange-500 bg-orange-100'
                : 'text-gray-600 hover:text-orange-500'
            }`}
            onClick={() => onTabChange('orders')}
          >
            <i className="fas fa-shopping-cart mr-2"></i>Orders
          </button>
          <button 
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'text-orange-500 bg-orange-100'
                : 'text-gray-600 hover:text-orange-500'
            }`}
            onClick={() => onTabChange('analytics')}
          >
            <i className="fas fa-chart-line mr-2"></i>Analytics
          </button>
        </div>
      </div>
    </header>
  );
}
