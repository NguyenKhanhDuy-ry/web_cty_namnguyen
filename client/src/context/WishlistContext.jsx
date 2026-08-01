import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const WISHLIST_STORAGE_PREFIX = "nnc_wishlist";

const WishlistContext = createContext(null);

const getWishlistStorageKey = (userId) => {
  if (userId) {
    return `${WISHLIST_STORAGE_PREFIX}_${userId}`;
  }

  return WISHLIST_STORAGE_PREFIX;
};

const readWishlist = (userId) => {
  try {
    const storageKey = getWishlistStorageKey(userId);
    const rawValue = window.localStorage.getItem(storageKey);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch {
    return [];
  }
};

const writeWishlist = (userId, items) => {
  try {
    const storageKey = getWishlistStorageKey(userId);
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Ignore storage errors and keep the UI resilient.
  }
};

export function WishlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      setItems([]);
      setIsReady(true);
      return;
    }

    setItems(readWishlist(user._id));
    setIsReady(true);
  }, [isAuthenticated, user?._id]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated || !user?._id) {
      return;
    }

    writeWishlist(user._id, items);
  }, [isAuthenticated, isReady, items, user?._id]);

  const toggleWishlist = (product) => {
    if (!product?._id) {
      return { added: false, requiredLogin: false };
    }

    if (!isAuthenticated || !user?._id) {
      return { added: false, requiredLogin: true };
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item._id === product._id);

      if (existingItem) {
        return currentItems.filter((item) => item._id !== product._id);
      }

      return [...currentItems, { ...product }];
    });

    return { added: true, requiredLogin: false };
  };

  const removeFromWishlist = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item._id !== productId));
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const isWishlisted = (productId) => {
    return items.some((item) => item._id === productId);
  };

  const value = {
    items,
    count: items.length,
    isReady,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
