import type { Metadata } from "next";
import ProductDetailsClient from "./product-details-client";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Product details | Aurelle Fine Jewelry",
  description: "Explore a jewelry piece from the Aurelle collection.",
};

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return <ProductDetailsClient slug={slug} />;
}
