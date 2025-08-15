const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
};

export const authAPI = {
  googleAuth: async (credential: string) => {
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    return handleResponse(response);
  },

  mockGoogleAuth: async (userData: { email: string; name: string }) => {
    const response = await fetch(`${API_BASE}/auth/google/mock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const notesAPI = {
  getAllNotes: async () => {
    const response = await fetch(`${API_BASE}/notes`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getNote: async (id: string) => {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createNote: async (noteData: any) => {
    const response = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    return handleResponse(response);
  },

  updateNote: async (id: string, noteData: any) => {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    return handleResponse(response);
  },

  deleteNote: async (id: string) => {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  uploadImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/notes/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  }
};

export const publicAPI = {
  getPublicNotes: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_BASE}/public/notes?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getPublicNote: async (slug: string) => {
    const response = await fetch(`${API_BASE}/public/notes/${slug}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};
