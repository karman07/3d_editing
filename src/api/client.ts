export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type ReqInitWithJson = RequestInit & { json?: any };

async function request(path: string, init: ReqInitWithJson = {}) {
  const headers: Record<string, string> = init.headers ? (init.headers as Record<string, string>) : {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body: BodyInit | undefined = init.body as BodyInit | undefined;
  if (init.json) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(init.json);
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers, body });
  const text = await res.text();
  let data: any = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText;
    throw new Error(msg || 'Request failed');
  }
  return data;
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, json?: any) => request(path, { method: 'POST', json }),
  put: (path: string, json?: any) => request(path, { method: 'PUT', json }),
  del: (path: string, json?: any) => request(path, { method: 'DELETE', json }),
  postForm: async (path: string, form: FormData) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.message || res.statusText);
    return data;
  },
};
