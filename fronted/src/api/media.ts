import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"


export const createMedia = async (data: any) => {
  const token = localStorage.getItem("token")
  const res = await axios.post(`${API_BASE_URL}/media`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

export const updateMedia = async (id: number, data: any) => {
  const token = localStorage.getItem("token")
  const res = await axios.put(`${API_BASE_URL}/media/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing in .env file")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset)

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  )

  return response.data.secure_url

}

export const getMedia = async ({
  page = 1,
  limit = 10,
  q = "",
}: {
  page?: number;
  limit?: number;
  q?: string;
}) => {
  const token = localStorage.getItem("token"); 
  const params: Record<string, any> = { page, limit };
  if (q) params.q = q;

  const res = await axios.get(`${API_BASE_URL}/media`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};

export const deleteMedia = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_BASE_URL}/media/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export async function searchMediaApi(query: string) {
  console.log("API HIT:", query); 
  const res = await fetch(`${API_BASE_URL}/media/search?q=${encodeURIComponent(query)}&limit=20&page=1`);
  if (!res.ok) throw new Error("Failed to fetch search results");
  const data = await res.json();
  console.log("API GOT DATA:", data);
  return data;
}




