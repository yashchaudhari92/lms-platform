import {
  login as loginService,
  logout as logoutService,
} from "../services/authService";

export default function useAuth() {
  const login = async (credentials) => {
    const token = await loginService(credentials);
    if (token) {
      return token; // success
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    logoutService();
    window.location.href = "/login";
  };

  return { login, logout };
}
