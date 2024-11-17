import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '../types';
import { mensProducts, womensProducts, kidsProducts, watchesProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProductsByCategory: (category: string) => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: React.ReactNode;
}

// Combine all initial products
const initialProducts: Product[] = [
  ...mensProducts,
  ...womensProducts,
  ...kidsProducts,
  ...watchesProducts
];

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>(() => {
    // Load products from localStorage if available
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : initialProducts;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProductsToStorage = (products: Product[]) => {
    localStorage.setItem('products', JSON.stringify(products));
  };

  const addProduct = useCallback((product: Product) => {
    const newProduct = {
      ...product,
      id: String(Date.now()),
      inStock: true,
      sizes: product.sizes || ['S', 'M', 'L', 'XL']
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts); // Save to localStorage
  }, [products]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    const updatedProducts = products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts); // Save to localStorage
  }, [products]);

  const deleteProduct = useCallback((productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts); // Save to localStorage
  }, [products]);

  const getProductsByCategory = useCallback((category: string) => {
    return products.filter(product => 
      category === 'All' ? true : product.category === category
    );
  }, [products]);

  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate refreshing products by loading from localStorage
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts)); // Use stored products
      } else {
        setProducts(initialProducts); // Fall back to initial products if no storage
      }
    } catch (err) {
      setError('Failed to refresh products');
      console.error('Error refreshing products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    refreshProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
