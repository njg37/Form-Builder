'use client';
import React, { useEffect, useState } from 'react';
import { fetchForms, fetchFormPreview, createForm, updateForm, deleteForm } from '../../api/formApi';
import { ClipLoader } from 'react-spinners'; // You can install react-spinners for loading animations

interface Field {
  label: string;
  type: string;
}

interface Form {
  id: string;
  name: string;
  fields: Field[];
}

const PreviewPage = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [formPreview, setFormPreview] = useState<Form | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>('');
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('');

  // Fetch all forms
  const loadForms = async () => {
    setLoading(true);
    try {
      const data: Form[] = await fetchForms();
      setForms(data);
      setError(null);
    } catch (err) {
      console.error('Error loading forms:', err);
      setError('Failed to load forms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch form preview based on selected form ID
  const loadFormPreview = async (formId: string) => {
    setLoading(true);
    try {
      const data = await fetchFormPreview(formId);
      setFormPreview(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching form preview:', err);
      setError('Failed to fetch form preview. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new form
  const handleCreateForm = async () => {
    setLoading(true);
    try {
      await createForm({ name: formName, fields });
      setFormName('');
      setFields([]);
      setShowCreate(false);
      loadForms();
    } catch (err) {
      console.error('Error creating form:', err);
      setError('Failed to create form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing form
  const handleUpdateForm = async () => {
    setLoading(true);
    try {
      await updateForm(selectedFormId, { name: formName, fields });
      setFormName('');
      setFields([]);
      setShowUpdate(false);
      loadForms();
    } catch (err) {
      console.error('Error updating form:', err);
      setError('Failed to update form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a form
  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    setLoading(true);
    try {
      await deleteForm(formId);
      loadForms();
    } catch (err) {
      console.error('Error deleting form:', err);
      setError('Failed to delete form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Form Preview</h1>

      {/* Error Handling */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <ClipLoader size={50} color="#4fa94d" loading={loading} />
        </div>
      )}

      {/* Form Management Buttons */}
      {!loading && !error && (
        <div className="flex justify-between mb-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => setShowCreate(true)}
          >
            Create Form
          </button>
        </div>
      )}

      {/* Form Selection Dropdown */}
      {!loading && !error && (
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Select a Form:</label>
          <select
            onChange={(e) => {
              const id = e.target.value;
              setSelectedFormId(id);
              if (id) loadFormPreview(id);
            }}
            className="border p-3 w-full text-lg"
            disabled={loading}
          >
            <option value="">Choose a form</option>
            {forms.map((form) => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Form Preview */}
      {formPreview && (
        <div className="border p-4 rounded-lg shadow-lg bg-gray-50 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{formPreview.name}</h2>
          <form>
            {formPreview.fields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-2 font-medium">{field.label}</label>
                <input
                  type={field.type}
                  className="border p-3 w-full rounded-md bg-white"
                  disabled
                />
              </div>
            ))}
          </form>
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                setFormName(formPreview.name);
                setFields(formPreview.fields);
                setShowUpdate(true);
              }}
            >
              Update
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => handleDeleteForm(formPreview.id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Create Form</h2>
            <input
              type="text"
              placeholder="Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="border p-3 w-full mb-4"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleCreateForm}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md ml-4"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Update Form Modal */}
      {showUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Update Form</h2>
            <input
              type="text"
              placeholder="Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="border p-3 w-full mb-4"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleUpdateForm}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md ml-4"
              onClick={() => setShowUpdate(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
