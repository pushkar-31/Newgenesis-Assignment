import api from "@/lib/axios";

interface LoginCredentials {
  username: string;
  password: string;
}

const DEMO_USERNAME = "pushkaradmin";
const DEMO_PASSWORD = "pushkar@321";

export const loginUser = async ({
  username,
  password,
}: LoginCredentials) => {
  if (
    username === DEMO_USERNAME &&
    password === DEMO_PASSWORD
  ) {
    return {
      accessToken: "pushkar-admin-demo-token",
    };
  }

  throw new Error("Invalid username or password.");
};
