import { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({
  products,
}: ProductTableProps) {
     const router = useRouter();
  return (
    <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Price
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Rating
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Stock
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
  key={product.id}
  onClick={() => router.push(`/products/${product.id}`)}
  className="cursor-pointer border-b last:border-b-0 hover:bg-gray-50"
>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Image
  src={product.thumbnail}
  alt={product.title}
  width={56}
  height={56}
  className="h-14 w-14 rounded-lg object-cover"
/>

                    <div>
                      <p className="font-medium text-gray-900">
                        {product.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID: {product.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.category}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  ⭐ {product.rating}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock} in stock
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}