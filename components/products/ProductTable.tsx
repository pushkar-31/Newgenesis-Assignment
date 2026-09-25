"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const router = useRouter();

  return (
    <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() =>
                  router.push(`/products/${product.id}`)
                }
                className="cursor-pointer border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover"
                    />

                    <div className="min-w-0">
                      <p className="max-w-xs truncate font-medium text-gray-900">
                        {product.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID: {product.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {product.category}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </td>

                <td className="px-6 py-4 text-gray-600">
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

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(product);
                      }}
                      className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(product);
                      }}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}