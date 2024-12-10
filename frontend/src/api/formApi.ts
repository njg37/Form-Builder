import axios from 'axios';

// Base URL for your API (make sure it's correct)
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all forms
export const fetchForms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }
};

// Create a new form
export const createForm = async (formData: { name: string; fields: object }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forms`, formData);
    return response.data;
  } catch (error) {
    console.error('Error creating form:', error);
    throw error;
  }
};

// Update an existing form by ID
export const updateForm = async (id: string, formData: { name: string; fields: object }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/forms/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error updating form with ID ${id}:`, error);
    throw error;
  }
};

// Delete a form by ID
export const deleteForm = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/forms/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting form with ID ${id}:`, error);
    throw error;
  }
};

// Fetch a form preview
export const fetchFormPreview = async (formId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/preview?formId=${formId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching form preview for ID ${formId}:`, error);
    throw error;
  }
};

