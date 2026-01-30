// Use environment variable or fallback to empty string for demo mode
const API_URL = import.meta.env.VITE_API_BASE_URL || '';

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
    // If no API URL is set, throw error to indicate demo mode
    if (!API_URL) {
      throw new Error('API_URL not configured. Please use demo mode or configure VITE_API_BASE_URL');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle empty response body for non-OK responses
    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      if (!response.ok) {
        throw new Error(`Empty response from server (Status: ${response.status})`);
      }
      // If it's an OK response but no JSON, it might be fine (e.g., 204 No Content)
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.error || `An error occurred (Status: ${response.status})`);
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
  async getStockItems(category?: string, lowStock?: boolean, search?: string, branchId?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (lowStock) params.append('lowStock', 'true');
    if (search) params.append('search', search);
    if (branchId) params.append('branchId', branchId);
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

  // Branch Management APIs
  async getBranches() {
    return this.request<any>('/admin/branches');
  }

  async getBranch(id: string) {
    return this.request<any>(`/admin/branches/${id}`);
  }

  async createBranch(data: any) {
    return this.request<any>('/admin/branches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBranch(id: string, data: any) {
    return this.request<any>(`/admin/branches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBranch(id: string) {
    return this.request<any>(`/admin/branches/${id}`, {
      method: 'DELETE',
    });
  }

  async getBranchStats(id: string) {
    return this.request<any>(`/admin/branches/${id}/stats`);
  }

  // Packages APIs
  async getPackages() {
    return this.request<any[]>('/packages');
  }

  async getPackage(id: string) {
    return this.request<any>(`/packages/${id}`);
  }

  async createPackage(data: any) {
    return this.request<any>('/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePackage(id: string, data: any) {
    return this.request<any>(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePackage(id: string) {
    return this.request<any>(`/packages/${id}`, {
      method: 'DELETE',
    });
  }

  // Rewards APIs
  async getRewards() {
    return this.request<any[]>('/rewards');
  }

  async getReward(id: string) {
    return this.request<any>(`/rewards/${id}`);
  }

  async createReward(data: any) {
    return this.request<any>('/rewards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReward(id: string, data: any) {
    return this.request<any>(`/rewards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReward(id: string) {
    return this.request<any>(`/rewards/${id}`, {
      method: 'DELETE',
    });
  }

  async redeemReward(rewardId: string) {
    return this.request<any>('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId }),
    });
  }

  // Transactions APIs
  async getTransactions(filters?: any) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.branchId) params.append('branchId', filters.branchId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/transactions${query}`);
  }

  async getTransaction(id: string) {
    return this.request<any>(`/transactions/${id}`);
  }

  logout() {
    this.clearToken();
  }
}

export const adminApi = new AdminApiService();
export default adminApi;
