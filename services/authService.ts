import api from "@/lib/axios";

interface LoginCredentials {
  username: string;
  password: string;
}

export const loginUser = async ({
  username,
  password,
}: LoginCredentials) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  return response.data;
};