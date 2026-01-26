const API_URL = 'http://localhost:3001/api';

class AdminApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('adminToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  // Stock APIs
  async getStockItems(category?: string, lowStock?: boolean, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (lowStock) params.append('lowStock', 'true');
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any>(`/stock${query}`);
  }

  async getStockItem(id: string) {
    return this.request<any>(`/stock/${id}`);
  }

  async createStockItem(data: any) {
    return this.request<any>('/stock', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStockItem(id: string, data: any) {
    return this.request<any>(`/stock/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStockItem(id: string) {
    return this.request<any>(`/stock/${id}`, {
      method: 'DELETE',
    });
  }

  async stockIn(id: string, quantity: number, reason: string, branchId?: string) {
    return this.request<any>(`/stock/${id}/stock-in`, {
      method: 'POST',
      body: JSON.stringify({ quantity, reason, branchId }),
    });
  }

  async stockOut(id: string, quantity: number, reason: string, branchId?: string) {
    return this.request<any>(`/stock/${id}/stock-out`, {
      method: 'POST',
      body: JSON.stringify({ quantity, reason, branchId }),
    });
  }

  async adjustStock(id: string, newQuantity: number, reason: string) {
    return this.request<any>(`/stock/${id}/adjust`, {
      method: 'POST',
      body: JSON.stringify({ newQuantity, reason }),
    });
  }

  async getLowStockItems() {
    return this.request<any>('/stock/alerts/low-stock');
  }

  async getStockMovements(stockItemId?: string, type?: string, limit = 50) {
    const params = new URLSearchParams();
    if (stockItemId) params.append('stockItemId', stockItemId);
    if (type) params.append('type', type);
    params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any>(`/stock/movements/all${query}`);
  }

  async getStockSummary() {
    return this.request<any>('/stock/summary/stats');
  }

  logout() {
    this.clearToken();
  }
}

export const adminApi = new AdminApiService();
export default adminApi;
