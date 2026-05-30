"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  defaultCatalog,
  deleteCategory,
  deleteProduct,
  formatPrice,
  getCatalogSnapshot,
  getCategoryById,
  getCategoryBySlug,
  getCategoryHref,
  getCategoryName,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getProductHref,
  getProductsByCategory,
  getRelatedProducts,
  getServerCatalogSnapshot,
  resetCatalogState,
  setCatalogState,
  slugify,
  subscribeToCatalog,
  type CatalogCategory,
  type CatalogCategoryInput,
  type CatalogProduct,
  type CatalogProductInput,
  type CatalogState,
  upsertCategory,
  upsertProduct,
} from "@/app/lib/catalog";

type CatalogContextValue = CatalogState & {
  hydrated: boolean;
  featuredProducts: CatalogProduct[];
  getCategoryById: (categoryId: string) => CatalogCategory | undefined;
  getCategoryBySlug: (slug: string) => CatalogCategory | undefined;
  getCategoryHref: (category: CatalogCategory) => string;
  getCategoryName: (categoryId: string) => string;
  getProductById: (productId: string) => CatalogProduct | undefined;
  getProductBySlug: (slug: string) => CatalogProduct | undefined;
  getProductHref: (product: Pick<CatalogProduct, "slug">) => string;
  getProductsByCategory: (categoryId: string) => CatalogProduct[];
  getRelatedProducts: (product: CatalogProduct, limit?: number) => CatalogProduct[];
  formatPrice: typeof formatPrice;
  slugify: typeof slugify;
  setCatalog: (state: CatalogState) => void;
  resetCatalog: () => void;
  upsertCategory: (category: CatalogCategoryInput) => void;
  deleteCategory: (categoryId: string) => void;
  upsertProduct: (product: CatalogProductInput) => void;
  deleteProduct: (productId: string) => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const catalog = useSyncExternalStore(
    subscribeToCatalog,
    getCatalogSnapshot,
    getServerCatalogSnapshot,
  );

  const value = useMemo<CatalogContextValue>(
    () => ({
      ...catalog,
      hydrated: catalog !== defaultCatalog,
      featuredProducts: getFeaturedProducts(catalog.products),
      getCategoryById: (categoryId) =>
        getCategoryById(catalog.categories, categoryId),
      getCategoryBySlug: (slug) => getCategoryBySlug(catalog.categories, slug),
      getCategoryHref,
      getCategoryName: (categoryId) =>
        getCategoryName(catalog.categories, categoryId),
      getProductById: (productId) => getProductById(catalog.products, productId),
      getProductBySlug: (slug) => getProductBySlug(catalog.products, slug),
      getProductHref,
      getProductsByCategory: (categoryId) =>
        getProductsByCategory(catalog.products, categoryId),
      getRelatedProducts: (product, limit) =>
        getRelatedProducts(catalog.products, product, limit),
      formatPrice,
      slugify,
      setCatalog: setCatalogState,
      resetCatalog: resetCatalogState,
      upsertCategory,
      deleteCategory,
      upsertProduct,
      deleteProduct,
    }),
    [catalog],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }

  return context;
}
