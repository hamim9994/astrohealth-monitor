
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `API request failed: ${response.status}`);
  }
  return response.json();
}

export const api = {
  health: () => request('/health'),
  dashboard: () => request('/dashboard'),
  indicators: () => request('/indicators'),
  actionPlan: () => request('/action-plan'),
  crew: () => request('/crew'),
  updateCrew: (payload) => request('/crew', { method: 'PUT', body: JSON.stringify(payload) }),
  createProfile: (payload) => request('/profiles', { method: 'POST', body: JSON.stringify(payload) }),
  profiles: () => request('/profiles'),
  updateProfile: (id, payload) => request(`/profiles/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  telemetry: () => request('/telemetry'),
  submitAssessment: (payload) => request('/assessment', { method: 'POST', body: JSON.stringify(payload) }),
  assessmentHistory: () => request('/assessments'),
};
