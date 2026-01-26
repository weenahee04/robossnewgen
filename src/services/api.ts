const API_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  }

  async register(email: string, password: string, name: string, phone?: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async demoLogin() {
    const response = await this.request<{ token: string; user: any }>('/auth/demo-login', {
      method: 'POST',
    });
    this.setToken(response.token);
    return response;
  }

  async lineLogin(lineUserId: string, displayName: string, pictureUrl?: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/line-login', {
      method: 'POST',
      body: JSON.stringify({ lineUserId, displayName, pictureUrl }),
    });
    this.setToken(response.token);
    return response;
  }

  async getMe() {
    return this.request<any>('/users/me');
  }

  async updateProfile(name: string, phone: string) {
    return this.request<any>('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ name, phone }),
    });
  }

  async getStats() {
    return this.request<any>('/users/stats');
  }

  async getBranches(lat?: number, lng?: number) {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/branches${query}`);
  }

  async getPackages() {
    return this.request<any[]>('/packages');
  }

  async getVehicles() {
    return this.request<any[]>('/vehicles');
  }

  async addVehicle(make: string, model: string, licensePlate: string) {
    return this.request<any>('/vehicles', {
      method: 'POST',
      body: JSON.stringify({ make, model, licensePlate }),
    });
  }

  async deleteVehicle(id: string) {
    return this.request<any>(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactions(limit = 50, offset = 0) {
    return this.request<any[]>(`/transactions?limit=${limit}&offset=${offset}`);
  }

  async createTransaction(branchId: string, packageId: string, paymentMethod?: string) {
    return this.request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify({ branchId, packageId, paymentMethod }),
    });
  }

  async getRewards(category?: string) {
    const params = category ? `?category=${category}` : '';
    return this.request<any[]>(`/rewards${params}`);
  }

  async redeemReward(rewardId: string) {
    return this.request<any>('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId }),
    });
  }

  async getRedemptions() {
    return this.request<any[]>('/rewards/redemptions');
  }

  async getNotifications(unreadOnly = false) {
    const params = unreadOnly ? '?unreadOnly=true' : '';
    return this.request<any[]>(`/notifications${params}`);
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async generateQR() {
    return this.request<any>('/qr/generate', {
      method: 'POST',
    });
  }

  async scanQR(code: string) {
    return this.request<any>('/qr/scan', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Admin APIs
  async getAdminDashboard() {
    return this.request<any>('/admin/dashboard');
  }

  async getFinancialReport(startDate?: string, endDate?: string, period?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (period) params.append('period', period);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any>(`/admin/financial-report${query}`);
  }

  async getAdminUsers(search?: string, tier?: string, limit = 50, offset = 0) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (tier) params.append('tier', tier);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any>(`/admin/users${query}`);
  }

  async getAdminAnalytics(days = 7) {
    return this.request<any>(`/admin/analytics?days=${days}`);
  }

  logout() {
    this.clearToken();
  }
}

export const api = new ApiService();
export default api;
