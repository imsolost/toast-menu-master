export interface ToastMenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  availability: 'available' | 'low-stock' | 'out-of-stock';
  prepTime: number | null;
  imageUrl: string | null;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  subtotal: string;
  tax: string;
  serviceFee: string;
  total: string;
  items: OrderItem[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: string;
  subtotal: string;
  tax: string;
  serviceFee: string;
  total: string;
  status: string;
  estimatedTime: number;
  createdAt: string;
}

export class ToastApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ToastApiError';
  }
}

export const toastApi = {
  async getMenuItems(): Promise<ToastMenuItem[]> {
    const response = await fetch('/api/menu');
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ToastApiError(
        errorData.message || 'Failed to fetch menu items',
        response.status,
        'MENU_FETCH_ERROR'
      );
    }
    
    return response.json();
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ToastApiError(
        errorData.message || 'Failed to create order',
        response.status,
        'ORDER_CREATE_ERROR'
      );
    }

    return response.json();
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await fetch(`/api/orders/${orderId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ToastApiError(
        errorData.message || 'Failed to fetch order',
        response.status,
        'ORDER_FETCH_ERROR'
      );
    }
    
    return response.json();
  }
};
