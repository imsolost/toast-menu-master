import { menuItems, orders, orderItems, type MenuItem, type InsertMenuItem, type Order, type InsertOrder, type OrderItem, type InsertOrderItem, type OrderWithItems } from "@shared/schema";

export interface IStorage {
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<OrderWithItems | undefined>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<string, MenuItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private orderItemId: number;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.orderItemId = 1;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.category === category
    );
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = `TO-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      estimatedTime: insertOrder.estimatedTime || null,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id)
      .map(item => ({
        ...item,
        menuItem: this.menuItems.get(item.menuItemId)!
      }));

    return {
      ...order,
      items
    };
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const orderItem: OrderItem = {
      ...insertOrderItem,
      id,
    };
    this.orderItems.set(id.toString(), orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
}

export const storage = new MemStorage();
