import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { fetchMenu } from "./menu-management";
import { toastRequest } from "./toast-client";

const RESTAURANT_GUID = process.env.RESTAURANT_GUID;

// Middleware to check Toast API configuration
function validateToastConfig(req: any, res: any, next: any) {
  if (!RESTAURANT_GUID) {
    return res.status(500).json({ 
      message: "Toast API configuration missing. Please check RESTAURANT_GUID environment variable." 
    });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get menu items from Toast API
  app.get("/api/menu", validateToastConfig, async (req, res) => {
    try {
      const menuItems = await fetchMenu();
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu from Toast API:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch menu from Toast API" 
      });
    }
  });

  // Get menu items by category
  app.get("/api/menu/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const menuItems = await storage.getMenuItemsByCategory(category);
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Create order via Toast API
  app.post("/api/orders", validateToastConfig, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const { items, ...orderInfo } = req.body;

      // Create order in Toast API
      const toastOrderPayload = {
        restaurantGuid: RESTAURANT_GUID,
        orderType: orderData.orderType.toUpperCase().replace('-', '_'),
        customer: {
          firstName: orderData.customerName.split(' ')[0] || orderData.customerName,
          lastName: orderData.customerName.split(' ').slice(1).join(' ') || '',
          phone: orderData.customerPhone
        },
        selections: items?.map((item: any) => ({
          itemGuid: item.menuItemId,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price)
        })) || [],
        totals: {
          subTotal: parseFloat(orderData.subtotal),
          tax: parseFloat(orderData.tax),
          total: parseFloat(orderData.total)
        }
      };

      const response = await toastRequest('POST', `/restaurants/${RESTAURANT_GUID}/orders`, toastOrderPayload);
      const toastOrder = response.data;
      
      // Store order locally
      const order = await storage.createOrder({
        ...orderData,
        status: "confirmed",
        estimatedTime: 25 // Default estimated time
      });

      // Store order items locally
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const validatedItem = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id
          });
          await storage.addOrderItem(validatedItem);
        }
      }

      res.json({ 
        ...order,
        toastOrderId: toastOrder.guid 
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create order" 
      });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
