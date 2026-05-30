import {
  productCategories as seedCategories,
  products as seedProducts,
} from "@/app/data/products";

export type CatalogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type CatalogImage = {
  src: string;
  alt: string;
  objectPosition: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  price: number | null;
  shortDescription: string;
  description: string;
  image: CatalogImage;
  badge?: string;
  rating: number;
  materials: string[];
  details: string[];
  care: string;
  featured: boolean;
  tags: string[];
};

export type CatalogState = {
  categories: CatalogCategory[];
  products: CatalogProduct[];
};

export type CatalogCategoryInput = Omit<CatalogCategory, "id"> & {
  id?: string;
};

export type CatalogProductInput = Omit<CatalogProduct, "id"> & {
  id?: string;
};

export const CATALOG_STORAGE_KEY = "aurelle-catalog";

const defaultCategoryId = "general";

function cloneStrings(values: readonly string[] | undefined) {
  return Array.isArray(values) ? values.map((value) => value.trim()) : [];
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureUniqueSlug(
  slug: string,
  takenSlugs: readonly string[],
  currentSlug?: string,
) {
  const baseSlug = toSlug(slug) || "item";
  const conflictingSlugs = new Set(
    takenSlugs.filter((takenSlug) => takenSlug !== currentSlug),
  );

  if (!conflictingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (conflictingSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

function ensureUniqueId(prefix: string, takenIds: readonly string[]) {
  let candidate = `${prefix}-${crypto.randomUUID()}`;

  while (takenIds.includes(candidate)) {
    candidate = `${prefix}-${crypto.randomUUID()}`;
  }

  return candidate;
}

function normalizeCategory(category: CatalogCategory): CatalogCategory {
  return {
    id: category.id || ensureUniqueId("category", []),
    slug: toSlug(category.slug || category.id) || category.id || defaultCategoryId,
    name: category.name.trim(),
    description: category.description.trim(),
    image: category.image || "",
  };
}

function normalizeProduct(
  product: CatalogProduct,
  categories: CatalogCategory[],
): CatalogProduct {
  const categoryExists = categories.some(
    (category) => category.id === product.categoryId,
  );

  return {
    id: product.id || ensureUniqueId("product", []),
    slug: toSlug(product.slug || product.name) || product.id || "product",
    name: product.name.trim(),
    categoryId: categoryExists
      ? product.categoryId
      : categories[0]?.id ?? defaultCategoryId,
    price:
      product.price === null
        ? null
        : Number.isFinite(product.price)
          ? Math.max(0, Math.round(product.price))
          : null,
    shortDescription: product.shortDescription.trim(),
    description: product.description.trim(),
    image: {
      src: product.image?.src || "",
      alt: product.image?.alt || product.name.trim(),
      objectPosition: product.image?.objectPosition || "50% 50%",
    },
    badge: product.badge?.trim() || undefined,
    rating: Number.isFinite(product.rating)
      ? Math.max(0, Math.min(5, Number(product.rating)))
      : 0,
    materials: cloneStrings(product.materials),
    details: cloneStrings(product.details),
    care: product.care.trim(),
    featured: Boolean(product.featured),
    tags: cloneStrings(product.tags),
  };
}

function seedCatalog(): CatalogState {
  const categories = seedCategories.map((category) =>
    normalizeCategory({
      id: category.id,
      slug: category.id,
      name: category.name,
      description: category.description,
      image: "",
    }),
  );

  const products = seedProducts.map((product) =>
    normalizeProduct(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        categoryId: product.category,
        price: product.price,
        shortDescription: product.shortDescription,
        description: product.description,
        image: {
          src: product.image.src,
          alt: product.image.alt,
          objectPosition: product.image.objectPosition,
        },
        badge: product.badge,
        rating: product.rating,
        materials: [...product.materials],
        details: [...product.details],
        care: product.care,
        featured: Boolean(product.featured),
        tags: [...product.tags],
      },
      categories,
    ),
  );

  return { categories, products };
}

export const defaultCatalog = seedCatalog();

export function slugify(value: string) {
  return toSlug(value);
}

export function formatPrice(price: number | null) {
  if (price === null) {
    return "Inquire";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getCategoryById(
  categories: CatalogCategory[],
  categoryId: string,
) {
  return categories.find((category) => category.id === categoryId);
}

export function getCategoryBySlug(
  categories: CatalogCategory[],
  slug: string,
) {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryName(
  categories: CatalogCategory[],
  categoryId: string,
) {
  return getCategoryById(categories, categoryId)?.name ?? "Jewelry";
}

export function getCategoryHref(category: CatalogCategory) {
  return `#${category.slug}`;
}

export function getProductHref(product: Pick<CatalogProduct, "slug">) {
  return `/products/${product.slug}`;
}

export function getProductsByCategory(
  products: CatalogProduct[],
  categoryId: string,
) {
  return products.filter((product) => product.categoryId === categoryId);
}

export function getFeaturedProducts(products: CatalogProduct[]) {
  return products.filter((product) => product.featured);
}

export function getNewProducts(products: CatalogProduct[]) {
  return products.filter(
    (product) => product.badge?.trim().toLowerCase() === "new",
  );
}

export function getProductBySlug(products: CatalogProduct[], slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(products: CatalogProduct[], productId: string) {
  return products.find((product) => product.id === productId);
}

export function getRelatedProducts(
  products: CatalogProduct[],
  product: CatalogProduct,
  limit = 3,
) {
  return products
    .filter(
      (candidate) =>
        candidate.categoryId === product.categoryId && candidate.id !== product.id,
    )
    .slice(0, limit);
}

function normalizeSearchValue(value: string) {
  return value.toLowerCase().trim();
}

export function matchesProductSearch(
  product: CatalogProduct,
  query: string,
  categoryName?: string,
) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableParts = [
    product.name,
    product.shortDescription,
    product.description,
    product.badge ?? "",
    product.tags.join(" "),
    product.materials.join(" "),
    categoryName ?? "",
  ];

  return searchableParts.some((part) =>
    normalizeSearchValue(part).includes(normalizedQuery),
  );
}

export function sortProductsByPrice(
  products: CatalogProduct[],
  sort: "featured" | "price-asc" | "price-desc",
) {
  if (sort === "featured") {
    return products;
  }

  return [...products].sort((left, right) => {
    const leftPrice = left.price;
    const rightPrice = right.price;

    if (leftPrice === null && rightPrice === null) {
      return 0;
    }

    if (leftPrice === null) {
      return 1;
    }

    if (rightPrice === null) {
      return -1;
    }

    return sort === "price-asc"
      ? leftPrice - rightPrice
      : rightPrice - leftPrice;
  });
}

export function isProductId(value: string): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeCatalog(state: unknown): CatalogState {
  if (
    typeof state !== "object" ||
    state === null ||
    !("categories" in state) ||
    !("products" in state)
  ) {
    return defaultCatalog;
  }

  const rawState = state as Partial<CatalogState>;
  const categories = Array.isArray(rawState.categories)
    ? rawState.categories
        .filter(
          (category): category is CatalogCategory =>
            typeof category === "object" &&
            category !== null &&
            "name" in category &&
            "slug" in category &&
            "description" in category &&
            typeof (category as CatalogCategory).name === "string" &&
            typeof (category as CatalogCategory).slug === "string" &&
            typeof (category as CatalogCategory).description === "string",
        )
        .map((category) =>
          normalizeCategory({
            id: typeof category.id === "string" ? category.id : "",
            slug: category.slug,
            name: category.name,
            description: category.description,
            image: typeof category.image === "string" ? category.image : "",
          }),
        )
    : [];

  const safeCategories = categories.length > 0 ? categories : defaultCatalog.categories;

  const products = Array.isArray(rawState.products)
    ? rawState.products
        .filter(
          (product): product is CatalogProduct =>
            typeof product === "object" &&
            product !== null &&
            "slug" in product &&
            "name" in product &&
            "categoryId" in product &&
            "shortDescription" in product &&
            "description" in product &&
            "materials" in product &&
            "details" in product &&
            "care" in product &&
            "tags" in product &&
            typeof (product as CatalogProduct).slug === "string" &&
            typeof (product as CatalogProduct).name === "string" &&
            typeof (product as CatalogProduct).categoryId === "string" &&
            typeof (product as CatalogProduct).shortDescription === "string" &&
            typeof (product as CatalogProduct).description === "string" &&
            Array.isArray((product as CatalogProduct).materials) &&
            Array.isArray((product as CatalogProduct).details) &&
            typeof (product as CatalogProduct).care === "string" &&
            Array.isArray((product as CatalogProduct).tags),
        )
        .map((product) =>
          normalizeProduct(
            {
              id: typeof product.id === "string" ? product.id : "",
              slug: product.slug,
              name: product.name,
              categoryId: product.categoryId,
              price:
                typeof product.price === "number" || product.price === null
                  ? product.price
                  : null,
              shortDescription: product.shortDescription,
              description: product.description,
              image: {
                src:
                  typeof product.image === "object" &&
                  product.image !== null &&
                  typeof product.image.src === "string"
                    ? product.image.src
                    : "",
                alt:
                  typeof product.image === "object" &&
                  product.image !== null &&
                  typeof product.image.alt === "string"
                    ? product.image.alt
                    : product.name,
                objectPosition:
                  typeof product.image === "object" &&
                  product.image !== null &&
                  typeof product.image.objectPosition === "string"
                    ? product.image.objectPosition
                    : "50% 50%",
              },
              badge:
                typeof product.badge === "string" ? product.badge : undefined,
              rating:
                typeof product.rating === "number" ? product.rating : 0,
              materials: product.materials.filter(
                (value): value is string => typeof value === "string",
              ),
              details: product.details.filter(
                (value): value is string => typeof value === "string",
              ),
              care: product.care,
              featured: Boolean(product.featured),
              tags: product.tags.filter((value): value is string => typeof value === "string"),
            },
            safeCategories,
          ),
        )
    : [];

  return {
    categories: safeCategories,
    products,
  };
}

export function createCatalogCategoryDraft(
  category?: Partial<CatalogCategory>,
): CatalogCategory {
  return normalizeCategory({
    id: category?.id ?? "",
    slug: category?.slug ?? "",
    name: category?.name ?? "",
    description: category?.description ?? "",
    image: category?.image ?? "",
  });
}

export function createCatalogProductDraft(
  product?: Partial<CatalogProduct>,
  categories: CatalogCategory[] = defaultCatalog.categories,
): CatalogProduct {
  return normalizeProduct(
    {
      id: product?.id ?? "",
      slug: product?.slug ?? "",
      name: product?.name ?? "",
      categoryId: product?.categoryId ?? categories[0]?.id ?? defaultCategoryId,
      price: product?.price ?? null,
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      image: product?.image ?? {
        src: "",
        alt: "",
        objectPosition: "50% 50%",
      },
      badge: product?.badge,
      rating: product?.rating ?? 0,
      materials: product?.materials ?? [],
      details: product?.details ?? [],
      care: product?.care ?? "",
      featured: product?.featured ?? false,
      tags: product?.tags ?? [],
    },
    categories,
  );
}

export function prepareCatalogCategoryInput(
  category: CatalogCategoryInput,
  existingCategories: CatalogCategory[],
) {
  const id = category.id?.trim() || ensureUniqueId("category", existingCategories.map((item) => item.id));
  const slug = ensureUniqueSlug(
    category.slug || category.name,
    existingCategories.map((item) => item.slug),
    existingCategories.find((item) => item.id === id)?.slug,
  );

  return normalizeCategory({
    id,
    slug,
    name: category.name,
    description: category.description,
    image: category.image,
  });
}

export function prepareCatalogProductInput(
  product: CatalogProductInput,
  existingProducts: CatalogProduct[],
  categories: CatalogCategory[],
) {
  const id = product.id?.trim() || ensureUniqueId("product", existingProducts.map((item) => item.id));
  const slug = ensureUniqueSlug(
    product.slug || product.name,
    existingProducts.map((item) => item.slug),
    existingProducts.find((item) => item.id === id)?.slug,
  );

  return normalizeProduct(
    {
      id,
      slug,
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      shortDescription: product.shortDescription,
      description: product.description,
      image: product.image,
      badge: product.badge,
      rating: product.rating,
      materials: product.materials,
      details: product.details,
      care: product.care,
      featured: product.featured,
      tags: product.tags,
    },
    categories,
  );
}

export function createSeedCatalog() {
  return defaultCatalog;
}

const catalogListeners = new Set<() => void>();
let catalogSnapshot: CatalogState = defaultCatalog;
let catalogHydrated = false;

function emitCatalogChange() {
  catalogListeners.forEach((listener) => listener());
}

function writeCatalogSnapshot(next: CatalogState) {
  catalogSnapshot = next;

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(
        CATALOG_STORAGE_KEY,
        JSON.stringify(next),
      );
    } catch {
      // Keep the in-memory snapshot available if storage is unavailable.
    }
  }

  emitCatalogChange();
}

function updateCatalogSnapshot(
  updater: (current: CatalogState) => CatalogState,
) {
  writeCatalogSnapshot(updater(catalogSnapshot));
}

function readStoredCatalog() {
  if (typeof window === "undefined") {
    return defaultCatalog;
  }

  try {
    const storedCatalog = window.sessionStorage.getItem(CATALOG_STORAGE_KEY);

    return storedCatalog ? normalizeCatalog(JSON.parse(storedCatalog)) : defaultCatalog;
  } catch {
    return defaultCatalog;
  }
}

export function getCatalogSnapshot() {
  return catalogSnapshot;
}

export function getServerCatalogSnapshot() {
  return defaultCatalog;
}

export function subscribeToCatalog(listener: () => void) {
  catalogListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      catalogListeners.delete(listener);
    };
  }

  if (!catalogHydrated) {
    catalogSnapshot = readStoredCatalog();
    catalogHydrated = true;
    queueMicrotask(emitCatalogChange);
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CATALOG_STORAGE_KEY) {
      catalogSnapshot = readStoredCatalog();
      emitCatalogChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    catalogListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function setCatalogState(nextState: CatalogState) {
  writeCatalogSnapshot(normalizeCatalog(nextState));
}

export function resetCatalogState() {
  writeCatalogSnapshot(defaultCatalog);
}

export function upsertCategory(category: CatalogCategoryInput) {
  updateCatalogSnapshot((current) => {
    const nextCategory = prepareCatalogCategoryInput(category, current.categories);
    const existingIndex = current.categories.findIndex(
      (item) => item.id === nextCategory.id,
    );

    if (existingIndex === -1) {
      return {
        ...current,
        categories: [...current.categories, nextCategory],
      };
    }

    const categories = [...current.categories];
    categories[existingIndex] = nextCategory;

    return {
      ...current,
      categories,
      products: current.products.map((product) =>
        product.categoryId === nextCategory.id
          ? { ...product, categoryId: nextCategory.id }
          : product,
      ),
    };
  });
}

export function deleteCategory(categoryId: string) {
  updateCatalogSnapshot((current) => {
    const categories = current.categories.filter((category) => category.id !== categoryId);
    const nextCategoryId = categories[0]?.id ?? defaultCategoryId;
    const products = current.products
      .filter((product) => product.categoryId !== categoryId)
      .map((product) =>
        categories.some((category) => category.id === product.categoryId)
          ? product
          : { ...product, categoryId: nextCategoryId },
      );

    return {
      categories,
      products,
    };
  });
}

export function upsertProduct(product: CatalogProductInput) {
  updateCatalogSnapshot((current) => {
    const nextProduct = prepareCatalogProductInput(
      product,
      current.products,
      current.categories,
    );
    const existingIndex = current.products.findIndex(
      (item) => item.id === nextProduct.id,
    );

    if (existingIndex === -1) {
      return {
        ...current,
        products: [...current.products, nextProduct],
      };
    }

    const products = [...current.products];
    products[existingIndex] = nextProduct;

    return {
      ...current,
      products,
    };
  });
}

export function deleteProduct(productId: string) {
  updateCatalogSnapshot((current) => ({
    ...current,
    products: current.products.filter((product) => product.id !== productId),
  }));
}
