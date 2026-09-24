
import api from "@/lib/axios";
import {
  CreateProductData,
  ProductsResponse,
  UpdateProductData,
  Product,
} from "@/types/product";

export const getProducts = async (
  limit: number,
  skip: number
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/products", {
    params: {
      limit,
      skip,
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
  skip: number
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    "/products/search",
    {
      params: {
        q: query,
        limit,
        skip,
      },
    }
  );

  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get<string[]>("/products/categories");

  return response.data;
};

export const addProduct = async (
  product: CreateProductData
): Promise<Product> => {
  const response = await api.post<Product>("/products/add", product);

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
  const response = await api.delete<Product>(`/products/${id}`);

  return response.data;
};

