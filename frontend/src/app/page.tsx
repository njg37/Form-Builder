'use client';
import React, { useEffect, useState } from 'react';
import { fetchForms, createForm, deleteForm } from '../api/formApi';

interface Field {
  label: string;
  type: string;
}

interface Form {
  id: string;
  name: string;
  fields: Field[];
}

const FormManagement = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState<Field[]>([{ label: '', type: 'text' }]);

  const loadForms = async () => {
    const data: Form[] = await fetchForms();
    setForms(data);
  };

  const handleAddField = () => {
    setFields([...fields, { label: '', type: 'text' }]);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleFieldChange = (index: number, key: keyof Field, value: string) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setFields(updatedFields);
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
      <div>
        {fields.map((field, index) => (
          <div key={index} className="mb-2 flex items-center">
            <input
              type="text"
              placeholder="Field Label"
              value={field.label}
              onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
              className="border p-2 mr-2"
            />
            <select
              value={field.type}
              onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
              className="border p-2 mr-2"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={() => handleRemoveField(index)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddField} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Field
        </button>
      </div>
      <ul className="mt-4">
        {forms.map((form) => (
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
