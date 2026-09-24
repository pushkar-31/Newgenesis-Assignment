import { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
    const router = useRouter();
  return (
    <div
  onClick={() => router.push(`/products/${product.id}`)}
  className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm md:hidden"
>
      <div className="flex gap-4">
       <Image
  src={product.thumbnail}
  alt={product.title}
  width={80}
  height={80}
  className="h-20 w-20 rounded-lg object-cover"
/>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900">
            {product.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {product.category}
          </p>

          <p className="mt-2 font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-sm text-gray-600">
          ⭐ {product.rating}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            product.stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.stock} in stock
        </span>
      </div>
    </div>
  );
}