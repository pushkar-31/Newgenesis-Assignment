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
import ProductForm from "@/components/products/ProductForm";

import {
  addProduct,
  deleteProduct,
  getAllSearchProducts,
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
  updateProduct,
} from "@/services/productService";

import {
  Product,
  CreateProductData,
} from "@/types/product";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize =
    Number(searchParams.get("pageSize")) || 10;

  const initialSearch =
    searchParams.get("search") || "";

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

  const [search, setSearch] =
    useState(initialSearch);

  const [debouncedSearch, setDebouncedSearch] =
    useState(initialSearch);

  const [category, setCategory] =
    useState(initialCategory);

  const [sortBy, setSortBy] =
    useState(initialSortBy);

  const [order, setOrder] =
    useState<"asc" | "desc">(initialOrder);

  const [categories, setCategories] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [retryCount, setRetryCount] =
    useState(0);

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [mutationError, setMutationError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

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
      setDebouncedSearch(search);
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (page !== 1) {
      params.set("page", String(page));
    }

    if (pageSize !== 10) {
      params.set("pageSize", String(pageSize));
    }

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (category) {
      params.set("category", category);
    }

    if (sortBy) {
      params.set("sortBy", sortBy);
    }

    if (sortBy && order !== "asc") {
      params.set("order", order);
    }

    const queryString = params.toString();

    router.replace(
      queryString
        ? `${pathname}?${queryString}`
        : pathname
    );
  }, [
    page,
    pageSize,
    debouncedSearch,
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

        if (debouncedSearch && category) {
          const response =
            await getAllSearchProducts(
              debouncedSearch
            );

          if (
            requestId !== requestIdRef.current
          ) {
            return;
          }

          let filteredProducts =
            response.products.filter(
              (product) =>
                product.category === category
            );

          if (sortBy) {
            filteredProducts =
              [...filteredProducts].sort(
                (a, b) => {
                  if (sortBy === "title") {
                    return order === "asc"
                      ? a.title.localeCompare(
                          b.title
                        )
                      : b.title.localeCompare(
                          a.title
                        );
                  }

                  if (sortBy === "price") {
                    return order === "asc"
                      ? a.price - b.price
                      : b.price - a.price;
                  }

                  if (sortBy === "rating") {
                    return order === "asc"
                      ? a.rating - b.rating
                      : b.rating - a.rating;
                  }

                  return 0;
                }
              );
          }

          const filteredTotal =
            filteredProducts.length;

          const startIndex =
            (page - 1) * pageSize;

          const paginatedProducts =
            filteredProducts.slice(
              startIndex,
              startIndex + pageSize
            );

          setProducts(paginatedProducts);
          setTotal(filteredTotal);

          return;
        }

        if (debouncedSearch) {
          const response =
            await searchProducts(
              debouncedSearch,
              pageSize,
              (page - 1) * pageSize,
              sortBy || undefined,
              sortBy ? order : undefined
            );

          if (
            requestId !== requestIdRef.current
          ) {
            return;
          }

          setProducts(response.products);
          setTotal(response.total);

          return;
        }

        if (category) {
          const response =
            await getProductsByCategory(
              category,
              pageSize,
              (page - 1) * pageSize,
              sortBy || undefined,
              sortBy ? order : undefined
            );

          if (
            requestId !== requestIdRef.current
          ) {
            return;
          }

          setProducts(response.products);
          setTotal(response.total);

          return;
        }

        const response = await getProducts(
          pageSize,
          (page - 1) * pageSize,
          sortBy || undefined,
          sortBy ? order : undefined
        );

        if (
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setProducts(response.products);
        setTotal(response.total);
      } catch (error) {
        if (
          requestId !== requestIdRef.current
        ) {
          return;
        }

        console.error(
          "Failed to load products:",
          error
        );

        setError(
          "Failed to load products. Please try again."
        );
      } finally {
        if (
          requestId === requestIdRef.current
        ) {
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

  const handlePageChange = (
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (
    newPageSize: number
  ) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSearchChange = (
    value: string
  ) => {
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

  const handleAddProduct = () => {
    setMutationError("");
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (
    product: Product
  ) => {
    setMutationError("");
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = async (
    data: CreateProductData
  ) => {
    setMutationError("");

    if (editingProduct) {
      const updatedProduct =
        await updateProduct(
          editingProduct.id,
          data
        );

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === updatedProduct.id
            ? {
                ...product,
                ...updatedProduct,
              }
            : product
        )
      );
    } else {
      const newProduct =
        await addProduct(data);

      setProducts((currentProducts) => [
        newProduct,
        ...currentProducts,
      ]);

      setTotal((currentTotal) => currentTotal + 1);
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (
    product: Product
  ) => {
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMutationError("");
      setDeletingId(product.id);

      await deleteProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );

      setTotal((currentTotal) =>
        Math.max(0, currentTotal - 1)
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      setMutationError(
        "Failed to delete product. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Products
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your product catalog.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <SearchBar
                value={search}
                onChange={handleSearchChange}
              />

              <button
                type="button"
                onClick={handleAddProduct}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                + Add Product
              </button>
            </div>
          </div>

          <div className="mb-6">
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

          {mutationError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {mutationError}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-white">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <p className="mt-3 text-sm text-gray-500">
                  Loading products...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border bg-white px-4 text-center">
              <p className="text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border bg-white px-4 text-center">
              <p className="text-lg font-medium text-gray-900">
                No products found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />

              <div className="space-y-4 md:hidden">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>

              <div className="mt-6">
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
              </div>
            </>
          )}
        </main>

        {showForm && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={handleSaveProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </AuthGuard>
  );
}