"use client";

import { FormEvent, useState } from "react";
import { CreateProductData, Product } from "@/types/product";

interface ProductFormProps {
  product?: Product | null;
  categories: string[];
  onSubmit: (data: CreateProductData) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(
    product?.description || ""
  );
  const [price, setPrice] = useState(
    product?.price?.toString() || ""
  );
  const [category, setCategory] = useState(
    product?.category || ""
  );
  const [stock, setStock] = useState(
    product?.stock?.toString() || ""
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedCategory = category.trim();

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!trimmedTitle) {
      setError("Product title is required.");
      return;
    }

    if (!trimmedDescription) {
      setError("Product description is required.");
      return;
    }

    if (!trimmedCategory) {
      setError("Product category is required.");
      return;
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setError("Price must be greater than 0.");
      return;
    }

    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setError(
        "Stock must be a whole number greater than or equal to 0."
      );
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        title: trimmedTitle,
        description: trimmedDescription,
        price: numericPrice,
        category: trimmedCategory,
        stock: numericStock,
      });
    } catch (error) {
      console.error("Failed to save product:", error);
      setError("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {product ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {product
                ? "Update product information."
                : "Add a new product to the dashboard."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Enter product title"
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter product description"
              rows={3}
              disabled={saving}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="0.00"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stock
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) =>
                  setStock(event.target.value)
                }
                placeholder="0"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>

            {categories.length > 0 ? (
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item
                      .split("-")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="Enter category"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : product
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}