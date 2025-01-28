import { toast } from "@/components/ui/use-toast";

const API_URL = "https://api.example.com"; // Replace with actual API URL

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  email?: string;
}

export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

class ApiService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  static clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  private static async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setToken(response.token);
    return response;
  }

  static async signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
    const response = await this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setToken(response.token);
    return response;
  }

  static async logout() {
    this.clearToken();
  }

  static async sendMessage(content: string): Promise<Message> {
    return this.request("/chat", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  static async getMessages(): Promise<Message[]> {
    return this.request("/chat/history");
  }
}

export default ApiService;
