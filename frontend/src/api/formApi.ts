import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchForms = async () => {
  const response = await axios.get(`${API_BASE_URL}/forms`);
  return response.data;
};

export const createForm = async (formData: { name: string; fields: object }) => {
  const response = await axios.post(`${API_BASE_URL}/forms`, formData);
  return response.data;
};

export const updateForm = async (id: string, formData: { name: string; fields: object }) => {
  const response = await axios.put(`${API_BASE_URL}/forms/${id}`, formData);
  return response.data;
};

export const deleteForm = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/forms/${id}`);
  return response.data;
};
