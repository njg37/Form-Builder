'use client';
import React, { useEffect, useState } from 'react';
import { fetchForms, createForm, deleteForm } from '../api/formApi';

const FormManagement = () => {
  const [forms, setForms] = useState([]);
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([{ label: '', type: 'text' }]);

  const loadForms = async () => {
    const data = await fetchForms();
    setForms(data);
  };

  const handleCreateForm = async () => {
    await createForm({ name: formName, fields });
    setFormName('');
    setFields([{ label: '', type: 'text' }]);
    loadForms();
  };

  const handleDeleteForm = async (id: string) => {
    await deleteForm(id);
    loadForms();
  };

  useEffect(() => {
    loadForms();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Form Management</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleCreateForm} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Form
        </button>
      </div>
      <ul>
        {forms.map((form: any) => (
          <li key={form.id} className="mb-2">
            <span>{form.name}</span>
            <button
              onClick={() => handleDeleteForm(form.id)}
              className="ml-4 text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormManagement;
