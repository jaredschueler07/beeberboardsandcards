const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// -- Projects --

export interface ProjectSummary {
  id: string;
  name: string;
  current_stage: string;
  updated_at: string;
}

export const api = {
  // Projects
  listProjects: () => request<ProjectSummary[]>('/projects'),
  getProject: (id: string) => request<any>(`/projects/${id}`),
  createProject: (data: { name?: string; brief?: string }) =>
    request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: Record<string, any>) =>
    request<any>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),

  // Card types
  createCardType: (projectId: string, data: { name: string; color?: string; count?: number }) =>
    request<any>(`/projects/${projectId}/card-types`, {
      method: 'POST', body: JSON.stringify(data),
    }),
  deleteCardType: (projectId: string, typeId: string) =>
    request<void>(`/projects/${projectId}/card-types/${typeId}`, { method: 'DELETE' }),

  // Cards
  createCard: (projectId: string, data: { type_id: string; name: string; cost?: number }) =>
    request<any>(`/projects/${projectId}/cards`, {
      method: 'POST', body: JSON.stringify(data),
    }),
  updateCard: (projectId: string, cardId: string, data: Record<string, any>) =>
    request<any>(`/projects/${projectId}/cards/${cardId}`, {
      method: 'PATCH', body: JSON.stringify(data),
    }),
  deleteCard: (projectId: string, cardId: string) =>
    request<void>(`/projects/${projectId}/cards/${cardId}`, { method: 'DELETE' }),

  // AI Generation
  generateConcepts: (projectId: string, data: { brief: string; brief_settings: any; count?: number }) =>
    request<any[]>(`/generate/${projectId}/concepts`, {
      method: 'POST', body: JSON.stringify(data),
    }),
  generateCardTypes: (projectId: string, data: {
    concept_title: string; concept_description?: string;
    mechanics?: string[]; brief_settings?: any; count?: number;
  }) =>
    request<any[]>(`/generate/${projectId}/card-types`, {
      method: 'POST', body: JSON.stringify(data),
    }),
  generateCards: (projectId: string, data: {
    concept_title?: string; concept_description?: string;
    mechanics?: string[]; type_id: string; type_name: string;
    type_count?: number; count?: number;
  }) =>
    request<any[]>(`/generate/${projectId}/cards`, {
      method: 'POST', body: JSON.stringify(data),
    }),
  runSimulation: (projectId: string, data: { game_count?: number }) =>
    request<any>(`/generate/${projectId}/simulate`, {
      method: 'POST', body: JSON.stringify(data),
    }),

  // Export
  exportPnPPdf: async (projectId: string, data: { paper_size?: string; show_crop_marks?: boolean }) => {
    const res = await fetch(`${API_BASE}/export/${projectId}/pnp-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API ${res.status}: ${body}`);
    }
    return res.blob();
  },

  exportTtsJson: async (projectId: string, data: { card_sheet_url?: string; back_url?: string }) => {
    const res = await fetch(`${API_BASE}/export/${projectId}/tts-json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API ${res.status}: ${body}`);
    }
    return res.blob();
  },

  // Health
  health: () => request<{ status: string }>('/health'),
};
