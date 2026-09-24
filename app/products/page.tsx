"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import ProductTable from "@/components/products/ProductTable";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/products/Pagination";
import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const skip = (page - 1) * pageSize;

        const data = await getProducts(pageSize, skip);

        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, pageSize, retryCount]);

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(total / pageSize);

    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleRetry = () => {
    setRetryCount((count) => count + 1);
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-100">
        <Navbar />

        <section className="p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your products
            </p>
          </div>

          {loading && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-600">
                Loading products...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-6 text-center">
              <p className="text-red-600">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-600">
                No products found.
              </p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <ProductTable products={products} />

              <div className="space-y-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}