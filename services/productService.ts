import api from "@/lib/axios";
import {
  CreateProductData,
  ProductsResponse,
  UpdateProductData,
  Product,
} from "@/types/product";

export const getProducts = async (
  limit: number,
  skip: number,
  sortBy?: string,
  order?: "asc" | "desc"
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/products", {
    params: {
      limit,
      skip,
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    },
  });

  return response.data;
};

export const getProductById = async (
  id: number
): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);

  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: "asc" | "desc"
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    "/products/search",
    {
      params: {
        q: query,
        limit,
        skip,
        ...(sortBy && { sortBy }),
        ...(order && { order }),
      },
    }
  );

  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get<string[]>(
    "/products/category-list"
  );

  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: "asc" | "desc"
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    `/products/category/${category}`,
    {
      params: {
        limit,
        skip,
        ...(sortBy && { sortBy }),
        ...(order && { order }),
      },
    }
  );

  return response.data;
};

export const getAllProducts = async (): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/products", {
    params: {
      limit: 0,
    },
  });

  return response.data;
};

export const getAllSearchProducts = async (
  query: string
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    "/products/search",
    {
      params: {
        q: query,
        limit: 0,
      },
    }
  );

  return response.data;
};

export const getAllCategoryProducts = async (
  category: string
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    `/products/category/${category}`,
    {
      params: {
        limit: 0,
      },
    }
  );

  return response.data;
};

export const addProduct = async (
  product: CreateProductData
): Promise<Product> => {
  const response = await api.post<Product>(
    "/products/add",
    product
  );

  return response.data;
};

export const updateProduct = async (
  id: number,
  product: UpdateProductData
): Promise<Product> => {
  const response = await api.put<Product>(
    `/products/${id}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (
  id: number
): Promise<Product> => {
  const response = await api.delete<Product>(
    `/products/${id}`
  );

  return response.data;
};