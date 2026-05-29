import CheckoutSummary from "@/app/components/Cart/CheckoutSummary";
import { products } from "@/app/data/products";

export default function CheckoutPage() {
  return (
    <main className="flex-1 bg-[#fbfaf7] px-4 py-20 sm:px-6 lg:px-8">
      <CheckoutSummary products={products} />
    </main>
  );
}
