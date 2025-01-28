import { toast } from "@/components/ui/use-toast";

const API_URL = "http://127.0.0.1:8000"; // Replace with actual API URL

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  email?: string;
}

export interface User {
  id: string;
  email: string;
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  }

  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      this.setToken(response.token);
      return response;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      throw error;
    }
  }

  static async signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await this.request("/auth/signup", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      this.setToken(response.token);
      return response;
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Could not create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  static async logout() {
    try {
      this.clearToken();
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Could not log out properly",
        variant: "destructive",
      });
      throw error;
    }
  }

  static async sendMessage(content: string): Promise<Message> {
    try {
      return await this.request("/chat", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  static async getMessages(): Promise<Message[]> {
    try {
      return await this.request("/chat/history");
    } catch (error) {
      toast({
        title: "Error Loading Messages",
        description: "Could not load chat history",
        variant: "destructive",
      });
      throw error;
    }
  }

  static async saveGoogleToken(token: string): Promise<void> {
    try {
      await this.request("/google/save-token", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      toast({
        title: "Token Saved",
        description: "Successfully saved Google Calendar token",
      });
    } catch (error) {
      toast({
        title: "Token Save Failed",
        description: "Could not save Google Calendar token",
        variant: "destructive",
      });
      throw error;
    }
  }

  static async getGoogleToken(): Promise<string | null> {
    try {
      const response = await this.request("/google/get-token");
      return response.token;
    } catch (error) {
      console.error('Failed to fetch Google token:', error);
      return null;
    }
  }
}

export default ApiService;