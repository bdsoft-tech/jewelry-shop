import CartContents from "@/app/components/Cart/CartContents";
import { products } from "@/app/data/products";

export default function CartPage() {
  return (
    <main className="flex-1 bg-[#fbfaf7] px-4 py-20 sm:px-6 lg:px-8">
      <CartContents products={products} />
    </main>
  );
}
