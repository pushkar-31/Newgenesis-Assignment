"use client";

import { useEffect, useRef, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import ProductTable from "@/components/products/ProductTable";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/products/Pagination";
import SearchBar from "@/components/products/SearchBar";
import FilterBar from "@/components/products/FilterBar";
import {
  getAllSearchProducts,
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/services/productService";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page")) || 1;

  const initialPageSize =
    Number(searchParams.get("pageSize")) || 10;

  const initialSearch = searchParams.get("search") || "";

  const initialCategory =
    searchParams.get("category") || "";

  const initialSortBy =
    searchParams.get("sortBy") || "";

  const initialOrder =
    searchParams.get("order") === "desc"
      ? "desc"
      : "asc";

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(
    initialPage >= 1 ? initialPage : 1
  );

  const [pageSize, setPageSize] = useState(
    [10, 20, 50].includes(initialPageSize)
      ? initialPageSize
      : 10
  );

  const [search, setSearch] = useState(initialSearch);

  const [debouncedSearch, setDebouncedSearch] =
    useState(initialSearch);

  const [category, setCategory] =
    useState(initialCategory);

  const [sortBy, setSortBy] =
    useState(initialSortBy);

  const [order, setOrder] =
    useState<"asc" | "desc">(initialOrder);

  const [categories, setCategories] = useState<string[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (category) {
      params.set("category", category);
    }

    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("order", order);
    }

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, [
    page,
    pageSize,
    search,
    category,
    sortBy,
    order,
    pathname,
    router,
  ]);

  useEffect(() => {
    const loadProducts = async () => {
      const requestId = ++requestIdRef.current;

      try {
        setLoading(true);
        setError("");

        let data;

        const skip = (page - 1) * pageSize;

        if (debouncedSearch && category) {
          const searchData =
            await getAllSearchProducts(debouncedSearch);

          const filteredProducts =
            searchData.products.filter(
              (product) =>
                product.category === category
            );

          const sortedProducts = [...filteredProducts];

          if (sortBy) {
            sortedProducts.sort((a, b) => {
              let comparison = 0;

              if (sortBy === "title") {
                comparison = a.title.localeCompare(
                  b.title
                );
              }

              if (sortBy === "price") {
                comparison = a.price - b.price;
              }

              if (sortBy === "rating") {
                comparison = a.rating - b.rating;
              }

              return order === "asc"
                ? comparison
                : -comparison;
            });
          }

          data = {
            products: sortedProducts.slice(
              skip,
              skip + pageSize
            ),
            total: sortedProducts.length,
            skip,
            limit: pageSize,
          };
        } else if (debouncedSearch) {
          data = await searchProducts(
            debouncedSearch,
            pageSize,
            skip,
            sortBy || undefined,
            sortBy ? order : undefined
          );
        } else if (category) {
          data = await getProductsByCategory(
            category,
            pageSize,
            skip,
            sortBy || undefined,
            sortBy ? order : undefined
          );
        } else {
          data = await getProducts(
            pageSize,
            skip,
            sortBy || undefined,
            sortBy ? order : undefined
          );
        }

        if (requestId !== requestIdRef.current) {
          return;
        }

        setProducts(data.products);
        setTotal(data.total);

        const totalPages = Math.ceil(
          data.total / pageSize
        );

        if (page > totalPages && totalPages > 0) {
          setPage(totalPages);
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        console.error(
          "Failed to load products:",
          error
        );

        setError("Failed to load products.");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    loadProducts();
  }, [
    page,
    pageSize,
    debouncedSearch,
    category,
    sortBy,
    order,
    retryCount,
  ]);

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(
      total / pageSize
    );

    if (
      newPage < 1 ||
      newPage > totalPages
    ) {
      return;
    }

    setPage(newPage);
  };

  const handlePageSizeChange = (
    newPageSize: number
  ) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (
    value: string
  ) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortByChange = (
    value: string
  ) => {
    setSortBy(value);
    setPage(1);
  };

  const handleOrderChange = (
    value: "asc" | "desc"
  ) => {
    setOrder(value);
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
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your products
                </p>
              </div>

              <SearchBar
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <FilterBar
              category={category}
              sortBy={sortBy}
              order={order}
              categories={categories}
              onCategoryChange={
                handleCategoryChange
              }
              onSortByChange={
                handleSortByChange
              }
              onOrderChange={
                handleOrderChange
              }
            />
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
              <p className="text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                <p className="text-gray-600">
                  No products found.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            products.length > 0 && (
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
                  onPageChange={
                    handlePageChange
                  }
                  onPageSizeChange={
                    handlePageSizeChange
                  }
                />
              </>
            )}
        </section>
      </main>
    </AuthGuard>
  );
}