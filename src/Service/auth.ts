import axios from "axios";
import { useRouter } from "vue-router";

const API_URL = "http://localhost:3692/api/v1/authen"; // Adjust this to match your API endpoint
const router = useRouter();

const AuthService = {
  async login(username: string, password: string) {
    const response = await axios.post(`${API_URL}/login`, {
      Username: username,
      Password: password,
    });
    if (response.data && response.data.token) {
      // Save token to localStorage or Vuex
      localStorage.setItem("authToken", response.data.token.access_token);
    }
    return response.data;
  },
  logout() {
    localStorage.removeItem("authToken");
    router.push({ name: "login" });
  },
  async verifyToken() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push({ name: "login" });
      throw new Error("No token found");
    }

    try {
      const response = await axios.get(`${API_URL}/Verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // This will be the result of ValidateToken(Token) from your backend
    } catch (error) {
      console.error("Token verification failed:", error);
      this.logout(); // Clear invalid token
      throw new Error("Invalid token");
    }
  },
};

export default AuthService;
