"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gem, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/app/components/Catalog/CatalogProvider";
import { hasDemoSession } from "@/app/lib/demo-auth";
import {
  createCatalogCategoryDraft,
  formatPrice,
  slugify,
  type CatalogCategory,
  type CatalogProduct,
} from "@/app/lib/catalog";

type CategoryFormState = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

type ProductFormState = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: string;
  priceOnRequest: boolean;
  shortDescription: string;
  description: string;
  badge: string;
  rating: string;
  materials: string;
  details: string;
  care: string;
  featured: boolean;
  tags: string;
  image: string;
  imageAlt: string;
  imageObjectPosition: string;
};

function buildCategoryForm(category?: Partial<CatalogCategory>): CategoryFormState {
  if (!category) {
    return {
      id: "",
      name: "",
      slug: "",
      description: "",
      image: "",
    };
  }

  const draft = createCatalogCategoryDraft(category);

  return {
    id: draft.id,
    name: draft.name,
    slug: draft.slug,
    description: draft.description,
    image: draft.image,
  };
}

function buildProductForm(
  product?: Partial<CatalogProduct>,
  categories: CatalogCategory[] = [],
  categoryId = "",
): ProductFormState {
  if (!product) {
    return {
      id: "",
      name: "",
      slug: "",
      categoryId: categoryId || categories[0]?.id || "",
      price: "",
      priceOnRequest: false,
      shortDescription: "",
      description: "",
      badge: "",
      rating: "4.8",
      materials: "",
      details: "",
      care: "",
      featured: false,
      tags: "",
      image: "",
      imageAlt: "",
      imageObjectPosition: "50% 50%",
    };
  }

  const draft = {
    id: product.id ?? "",
    name: product.name ?? "",
    slug: product.slug ?? "",
    categoryId: (product.categoryId ?? categoryId) || categories[0]?.id || "",
    price: product.price ?? null,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    badge: product.badge ?? "",
    rating: product.rating ?? 4.8,
    materials: product.materials ?? [],
    details: product.details ?? [],
    care: product.care ?? "",
    featured: product.featured ?? false,
    tags: product.tags ?? [],
    image: product.image ?? {
      src: "",
      alt: "",
      objectPosition: "50% 50%",
    },
  };

  return {
    id: draft.id,
    name: draft.name,
    slug: draft.slug,
    categoryId: draft.categoryId,
    price: draft.price === null ? "" : String(draft.price),
    priceOnRequest: draft.price === null,
    shortDescription: draft.shortDescription,
    description: draft.description,
    badge: draft.badge ?? "",
    rating: String(draft.rating ?? 4.8),
    materials: draft.materials.join(", "),
    details: draft.details.join(", "),
    care: draft.care,
    featured: draft.featured,
    tags: draft.tags.join(", "),
    image: draft.image.src,
    imageAlt: draft.image.alt,
    imageObjectPosition: draft.image.objectPosition,
  };
}

function parseList(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function CatalogImageField({
  label,
  image,
  previewUrl,
  onFileChange,
}: {
  label: string;
  image: string;
  previewUrl: string;
  onFileChange: (file: File | null) => void;
}) {
  return (
    <label className="text-sm font-medium text-stone-700">
      {label}
      <input
        type="file"
        accept="image/*"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2"
      />
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={label}
          className="mt-3 h-36 w-full rounded-lg object-cover"
        />
      ) : image ? (
        <img
          src={image}
          alt={label}
          className="mt-3 h-36 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="mt-3 flex h-36 items-center justify-center rounded-lg border border-dashed border-stone-300 text-xs text-stone-500">
          No image selected
        </div>
      )}
    </label>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const {
    categories,
    deleteCategory,
    deleteProduct,
    products,
    resetCatalog,
    upsertCategory,
    upsertProduct,
  } = useCatalog();
  const [accessState, setAccessState] = useState<"checking" | "authorized">(
    "checking",
  );

  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(() =>
    buildCategoryForm(),
  );
  const [productForm, setProductForm] = useState<ProductFormState>(() =>
    buildProductForm(undefined, categories, categories[0]?.id ?? ""),
  );
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [categoryPreviewUrl, setCategoryPreviewUrl] = useState("");
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreviewUrl, setProductPreviewUrl] = useState("");

  useEffect(() => {
    if (hasDemoSession("admin")) {
      const timerId = window.setTimeout(() => {
        setAccessState("authorized");
      }, 0);

      return () => window.clearTimeout(timerId);
    }

    router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    if (
      categories.length > 0 &&
      !categories.some((category) => category.id === productForm.categoryId)
    ) {
      const timerId = window.setTimeout(() => {
        setProductForm((current) => ({
          ...current,
          categoryId: categories[0].id,
        }));
      }, 0);

      return () => window.clearTimeout(timerId);
    }
  }, [categories, productForm.categoryId]);

  useEffect(() => {
    return () => {
      if (categoryPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(categoryPreviewUrl);
      }
    };
  }, [categoryPreviewUrl]);

  useEffect(() => {
    return () => {
      if (productPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(productPreviewUrl);
      }
    };
  }, [productPreviewUrl]);

  const totalValue = useMemo(
    () => products.reduce((total, product) => total + (product.price ?? 0), 0),
    [products],
  );

  if (accessState !== "authorized") {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(215,181,109,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,30,63,0.12),_transparent_30%),linear-gradient(160deg,_#fbfaf7_0%,_#f3ece0_55%,_#fbfaf7_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full max-w-xl rounded-[32px] border border-white/70 bg-white/80 p-6 text-center shadow-[0_24px_80px_rgba(63,47,20,0.16)] backdrop-blur-xl sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f2a24] text-[#d7b56d]">
            <Gem size={24} aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
            Admin access required
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#1f2a24] sm:text-4xl">
            Redirecting to the admin sign in screen.
          </h1>
          <p className="mt-4 text-base leading-8 text-stone-600">
            This area is protected by a demo session stored in session storage.
          </p>
          <Link
            href="/admin/login"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#1f2a24,_#3a4b42)] px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(31,42,36,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_36px_rgba(31,42,36,0.28)]"
          >
            Go to admin sign in
          </Link>
        </section>
      </main>
    );
  }

  async function handleSaveCategory() {
    if (!categoryForm.name.trim()) {
      return;
    }

    const image =
      categoryFile !== null ? await fileToDataUrl(categoryFile) : categoryForm.image;

    upsertCategory({
      id: categoryForm.id,
      name: categoryForm.name,
      slug: categoryForm.slug || slugify(categoryForm.name),
      description: categoryForm.description,
      image,
    });

    setCategoryForm(buildCategoryForm());
    setCategoryFile(null);
    setCategoryPreviewUrl("");
  }

  async function handleSaveProduct() {
    if (!productForm.name.trim()) {
      return;
    }

    const image =
      productFile !== null ? await fileToDataUrl(productFile) : productForm.image;

    upsertProduct({
      id: productForm.id,
      name: productForm.name,
      slug: productForm.slug || slugify(productForm.name),
      categoryId: productForm.categoryId,
      price: productForm.priceOnRequest
        ? null
        : Number(productForm.price || 0),
      shortDescription: productForm.shortDescription,
      description: productForm.description,
      badge: productForm.badge.trim() || undefined,
      rating: Number(productForm.rating || 0),
      materials: parseList(productForm.materials),
      details: parseList(productForm.details),
      care: productForm.care,
      featured: productForm.featured,
      tags: parseList(productForm.tags),
      image: {
        src: image,
        alt: productForm.imageAlt || productForm.name,
        objectPosition: productForm.imageObjectPosition || "50% 50%",
      },
    });

    setProductForm(buildProductForm(undefined, categories, categories[0]?.id ?? ""));
    setProductFile(null);
    setProductPreviewUrl("");
  }

  function startEditCategory(category: CatalogCategory) {
    setCategoryForm(buildCategoryForm(category));
    setCategoryFile(null);
    setCategoryPreviewUrl("");
  }

  function startEditProduct(product: CatalogProduct) {
    setProductForm(buildProductForm(product, categories, product.categoryId));
    setProductFile(null);
    setProductPreviewUrl("");
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
              Admin demo
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-[#1f2a24] sm:text-4xl">
              Jewelry store manager
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
              Add, edit, and delete categories or products from the browser.
              Changes update the storefront immediately and stay in this session
              until the tab closes.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={resetCatalog}
              className="rounded-md border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
            >
              Reset demo data
            </button>
            <Link
              href="/products"
              className="rounded-md bg-[#1f2a24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2d3b33]"
            >
              View storefront
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Metric label="Products" value={products.length} />
          <Metric label="Categories" value={categories.length} />
          <Metric label="Catalog value" value={formatPrice(totalValue)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-[#1f2a24] sm:text-2xl">
                Category management
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCategoryForm(buildCategoryForm());
                  setCategoryFile(null);
                  setCategoryPreviewUrl("");
                }}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700"
              >
                New category
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <Input
                label="Category name"
                value={categoryForm.name}
                onChange={(value) =>
                  setCategoryForm((current) => ({
                    ...current,
                    name: value,
                    slug: current.id ? current.slug : slugify(value),
                  }))
                }
              />

              <Input
                label="Slug"
                value={categoryForm.slug}
                onChange={(value) =>
                  setCategoryForm((current) => ({
                    ...current,
                    slug: slugify(value),
                  }))
                }
              />

              <label className="text-sm font-medium text-stone-700">
                Description
                <textarea
                  value={categoryForm.description}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="mt-2 min-h-24 w-full rounded-md border border-stone-200 px-3 py-2 outline-none focus:border-[#8b1e3f]"
                />
              </label>

              <CatalogImageField
                label="Category image"
                image={categoryForm.image}
                previewUrl={categoryPreviewUrl}
                onFileChange={(file) => {
                  if (categoryPreviewUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(categoryPreviewUrl);
                  }

                  setCategoryFile(file);
                  setCategoryPreviewUrl(file ? URL.createObjectURL(file) : "");
                }}
              />

              <button
                type="button"
                onClick={handleSaveCategory}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f2a24] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2d3b33]"
              >
                <Plus size={18} />
                {categoryForm.id ? "Update category" : "Add category"}
              </button>
            </div>

            <div className="mt-8 space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 rounded-lg border border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f7f1e8] text-xs text-stone-500">
                        No image
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-[#1f2a24]">
                        {category.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        /products#{category.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditCategory(category)}
                      className="rounded-md border border-stone-300 p-2 text-stone-700 transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteCategory(category.id);

                        if (categoryForm.id === category.id) {
                          setCategoryForm(buildCategoryForm());
                          setCategoryFile(null);
                          setCategoryPreviewUrl("");
                        }
                      }}
                      disabled={categories.length <= 1}
                      className="rounded-md border border-red-200 p-2 text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-[#1f2a24] sm:text-2xl">
                <Gem size={22} /> Product management
              </h2>
              <button
                type="button"
                onClick={() => {
                  setProductForm(
                    buildProductForm(undefined, categories, categories[0]?.id ?? ""),
                  );
                  setProductFile(null);
                  setProductPreviewUrl("");
                }}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700"
              >
                New product
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <Input
                label="Product name"
                value={productForm.name}
                onChange={(value) =>
                  setProductForm((current) => ({
                    ...current,
                    name: value,
                    slug: current.id ? current.slug : slugify(value),
                    imageAlt: current.imageAlt || value,
                  }))
                }
              />

              <Input
                label="Slug"
                value={productForm.slug}
                onChange={(value) =>
                  setProductForm((current) => ({
                    ...current,
                    slug: slugify(value),
                  }))
                }
              />

              <label className="text-sm font-medium text-stone-700">
                Category
                <select
                  value={productForm.categoryId}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      categoryId: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Price"
                  type="number"
                  value={productForm.price}
                  onChange={(value) =>
                    setProductForm((current) => ({ ...current, price: value }))
                  }
                  disabled={productForm.priceOnRequest}
                />
                <label className="flex items-center gap-2 self-end text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={productForm.priceOnRequest}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        priceOnRequest: event.target.checked,
                      }))
                    }
                  />
                  Price on request
                </label>
                <Input
                  label="Rating"
                  type="number"
                  value={productForm.rating}
                  onChange={(value) =>
                    setProductForm((current) => ({ ...current, rating: value }))
                  }
                />
                <Input
                  label="Badge"
                  value={productForm.badge}
                  onChange={(value) =>
                    setProductForm((current) => ({ ...current, badge: value }))
                  }
                />
              </div>

              <Input
                label="Short description"
                value={productForm.shortDescription}
                onChange={(value) =>
                  setProductForm((current) => ({
                    ...current,
                    shortDescription: value,
                  }))
                }
              />

              <label className="text-sm font-medium text-stone-700">
                Description
                <textarea
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="mt-2 min-h-24 w-full rounded-md border border-stone-200 px-3 py-2 outline-none focus:border-[#8b1e3f]"
                />
              </label>

              <CatalogImageField
                label="Product image"
                image={productForm.image}
                previewUrl={productPreviewUrl}
                onFileChange={(file) => {
                  if (productPreviewUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(productPreviewUrl);
                  }

                  setProductFile(file);
                  setProductPreviewUrl(file ? URL.createObjectURL(file) : "");
                }}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Image alt text"
                  value={productForm.imageAlt}
                  onChange={(value) =>
                    setProductForm((current) => ({ ...current, imageAlt: value }))
                  }
                />
                <Input
                  label="Image object position"
                  value={productForm.imageObjectPosition}
                  onChange={(value) =>
                    setProductForm((current) => ({
                      ...current,
                      imageObjectPosition: value,
                    }))
                  }
                />
              </div>

              <label className="text-sm font-medium text-stone-700">
                Materials
                <textarea
                  value={productForm.materials}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      materials: event.target.value,
                    }))
                  }
                  className="mt-2 min-h-20 w-full rounded-md border border-stone-200 px-3 py-2 outline-none focus:border-[#8b1e3f]"
                />
              </label>

              <label className="text-sm font-medium text-stone-700">
                Details
                <textarea
                  value={productForm.details}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      details: event.target.value,
                    }))
                  }
                  className="mt-2 min-h-20 w-full rounded-md border border-stone-200 px-3 py-2 outline-none focus:border-[#8b1e3f]"
                />
              </label>

              <Input
                label="Care"
                value={productForm.care}
                onChange={(value) =>
                  setProductForm((current) => ({ ...current, care: value }))
                }
              />

              <Input
                label="Tags"
                value={productForm.tags}
                onChange={(value) =>
                  setProductForm((current) => ({ ...current, tags: value }))
                }
              />

              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      featured: event.target.checked,
                    }))
                  }
                />
                Featured product
              </label>

              <button
                type="button"
                onClick={handleSaveProduct}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#8b1e3f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#741832]"
              >
                <Plus size={18} />
                {productForm.id ? "Update product" : "Add product"}
              </button>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#1f2a24]">
              Product list
            </h2>
            <p className="text-sm text-stone-500">
              {products.length} item{products.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {products.length === 0 ? (
              <div className="rounded-lg border border-dashed border-stone-300 p-8 text-sm text-stone-600">
                No products yet. Create the first item above.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="grid gap-4 rounded-xl border border-stone-200 p-4 md:grid-cols-[130px_minmax(0,1fr)_auto]"
                >
                  {product.image.src ? (
                    <img
                      src={product.image.src}
                      alt={product.image.alt}
                      className="h-40 w-full rounded-lg object-cover md:h-32"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg bg-[#f7f1e8] text-xs text-stone-500 md:h-32">
                      No image
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-[#1f2a24] sm:text-lg">
                        {product.name}
                      </p>
                      {product.badge ? (
                        <span className="rounded-full bg-[#f7f1e8] px-2 py-1 text-xs font-semibold text-[#8b6d2f]">
                          {product.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-stone-500">
                      {product.slug} · {categories.find((category) => category.id === product.categoryId)?.name ?? "No category"}
                    </p>
                    <p className="mt-2 text-sm text-stone-600">
                      {product.shortDescription}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#8b1e3f]">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex gap-3 md:flex-col">
                    <button
                      type="button"
                      onClick={() => startEditProduct(product)}
                      className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteProduct(product.id);

                        if (productForm.id === product.id) {
                          setProductForm(
                            buildProductForm(undefined, categories, categories[0]?.id ?? ""),
                          );
                          setProductFile(null);
                          setProductPreviewUrl("");
                        }
                      }}
                      className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-medium text-stone-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#1f2a24] sm:text-4xl">{value}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="text-sm font-medium text-stone-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 outline-none focus:border-[#8b1e3f] disabled:bg-stone-100"
      />
    </label>
  );
}
