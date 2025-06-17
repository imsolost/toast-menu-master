import { toastRequest } from './toast-client';

function log(message: string, ...args: any[]) {
  console.log(`[MENU] ${message}`, ...args);
}

// Menu caching
interface CachedMenu {
  data: any;
  timestamp: number;
  ttl: number;
}

const menuCache = new Map<string, CachedMenu>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedMenu(key: string): any | null {
  const cached = menuCache.get(key);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > cached.ttl;
  if (isExpired) {
    menuCache.delete(key);
    return null;
  }
  
  log(`Menu cache hit for ${key}`);
  return cached.data;
}

function setCachedMenu(key: string, data: any): void {
  menuCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: CACHE_TTL
  });
  log(`Menu cached for ${key}`);
}

export async function fetchMenu() {
  try {
    const restaurantId = process.env.RESTAURANT_GUID;
    const basePriceMenuGuid = "09c1b0bc-2c15-4229-bbe9-875187c451ab";

    // Check cache first
    const cacheKey = `menu_${restaurantId}_${basePriceMenuGuid}`;
    const cachedMenu = getCachedMenu(cacheKey);
    if (cachedMenu) {
      return cachedMenu;
    }

    // Get the menu data from Toast API
    const response = await toastRequest(
      'GET',
      `/menus/v2/menus?restaurantGuid=${restaurantId}`
    );

    const menuData = response.data;
    const basePriceMenu = menuData.menus?.find((m: any) => m.guid === basePriceMenuGuid);
    
    if (!basePriceMenu) {
      throw new Error(`Base Price Menu not found`);
    }
    
    log(`Loading menu: ${basePriceMenu.name} with ${basePriceMenu.menuGroups?.length || 0} groups`);

    // Transform the menu data for our application
    const transformedMenuItems: any[] = [];
    
    // Define images for menu items
    const itemImages: Record<string, string> = {
      // Soda items
      "Coke": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop",
      "Pepsi": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
      "Ginger Ale": "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=300&fit=crop",
      "Dr. Pepper": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&h=300&fit=crop",
      
      // Kids items
      "Hot Dog": "https://images.unsplash.com/photo-1612392062798-2508a1fe4f78?w=400&h=300&fit=crop",
      "Hamburger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      "Chicken Fingers": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
      
      // Sandwich items
      "Turkey": "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop",
      "Ham & Cheese": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
      "Grilled Chicken": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      "Grilled Cheese": "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop"
    };
    
    if (basePriceMenu && basePriceMenu.menuGroups) {
      basePriceMenu.menuGroups.forEach((group: any) => {
        if (group.menuItems) {
          group.menuItems.forEach((item: any) => {
            transformedMenuItems.push({
              id: item.guid,
              name: item.name,
              description: item.description || "",
              price: item.price?.toString() || "0",
              category: group.name,
              availability: "available", // Unlimited stock in test restaurant
              prepTime: null, // Remove prep time display
              imageUrl: itemImages[item.name] || null
            });
          });
        }
      });
    }

    log(`Transformed ${transformedMenuItems.length} menu items for application`);
    
    // Cache the results
    setCachedMenu(cacheKey, transformedMenuItems);
    
    return transformedMenuItems;
  } catch (error: any) {
    log('Error fetching menu data:', error.response?.data || error.message);
    throw error;
  }
}