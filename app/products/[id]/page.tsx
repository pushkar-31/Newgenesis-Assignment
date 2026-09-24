"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import { getProductById } from "@/services/productService";
import { Product } from "@/types/product";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const id = Number(params.id);

        if (!Number.isInteger(id) || id <= 0) {
          setError("Product not found.");
          return;
        }

        const data = await getProductById(id);

        setProduct(data);
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );

        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-100">
        <Navbar />

        <section className="p-4 md:p-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← Back
          </button>

          {loading && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-600">
                Loading product...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Product Not Found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                The product you are looking for does not
                exist.
              </p>

              <button
                type="button"
                onClick={() => router.push("/products")}
                className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Back to Products
              </button>
            </div>
          )}

          {!loading && !error && product && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {product.images.length > 1 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {product.images
                        .slice(0, 4)
                        .map((image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50"
                          >
                            <Image
                              src={image}
                              alt={`${product.title} ${
                                index + 1
                              }`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium capitalize text-blue-600">
                    {product.category}
                  </p>

                  <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    {product.title}
                  </h1>

                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                      ⭐ {product.rating}
                    </span>
                  </div>

                  <p className="mt-6 leading-7 text-gray-600">
                    {product.description}
                  </p>

                  <div className="mt-8 grid gap-4 border-t pt-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Stock
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {product.stock} units
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Brand
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {product.brand || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        SKU
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {product.sku}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Availability
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {product.availabilityStatus}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Shipping
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {product.shippingInformation}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Warranty
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {product.warrantyInformation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t pt-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Reviews
                </h2>

                <div className="mt-5 space-y-4">
                  {product.reviews.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No reviews available.
                    </p>
                  ) : (
                    product.reviews.map(
                      (review, index) => (
                        <div
                          key={`${review.reviewerEmail}-${index}`}
                          className="rounded-xl border bg-gray-50 p-5"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {review.reviewerName}
                              </p>

                              <p className="text-xs text-gray-500">
                                {review.reviewerEmail}
                              </p>
                            </div>

                            <span className="text-sm font-medium text-yellow-600">
                              ⭐ {review.rating}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            {review.comment}
                          </p>

                          <p className="mt-3 text-xs text-gray-400">
                            {new Date(
                              review.date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}