'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import styles from './styles/FormBuilder.module.css';
import { Field } from '../../types/FormTypes';
import { createForm, deleteForm, updateForm, fetchForms } from '../../api/formApi';

// Initial Field Options
const initialFieldOptions: Field[] = [
  { id: 'text-1', type: 'text', label: 'Text Input', placeholder: 'Enter text' },
  { id: 'number-2', type: 'number', label: 'Number Input', placeholder: 'Enter number' },
  { id: 'checkbox-3', type: 'checkbox', label: 'Checkbox' },
  { id: 'radio-4', type: 'radio', label: 'Radio Button' },
];

export default function FormBuilder() {
  const [forms, setForms] = useState<{ id: string; name: string; fields: Field[] }[]>([]);
  const [formName, setFormName] = useState('');
  const [editingForm, setEditingForm] = useState<{ id: string; name: string; fields: Field[] } | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [tempFieldLabel, setTempFieldLabel] = useState('');
  const [tempFieldPlaceholder, setTempFieldPlaceholder] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle drag end event
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || !editingForm) return;

    const activeField = initialFieldOptions.find((option) => option.id === active.id);

    if (activeField) {
      // Adding a new field
      const newFields = [...editingForm.fields, { ...activeField, id: `${activeField.id}-${Date.now()}` }];
      setEditingForm({ ...editingForm, fields: newFields });
    } else {
      // Reordering existing fields
      const oldIndex = editingForm.fields.findIndex((field) => field.id === active.id);
      const newIndex = editingForm.fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const updatedFields = arrayMove(editingForm.fields, oldIndex, newIndex);
        setEditingForm({ ...editingForm, fields: updatedFields });
      }
    }
  };

  // Handle editing a field
  const handleEditField = (fieldId: string) => {
    if (editingForm) {
      const fieldToEdit = editingForm.fields.find(field => field.id === fieldId);
      if (fieldToEdit) {
        setTempFieldLabel(fieldToEdit.label);
        setTempFieldPlaceholder(fieldToEdit.placeholder || '');
        setEditingFieldId(fieldId);
      }
    }
  };

  // Handle saving edited field
  const handleSaveField = () => {
    if (editingForm && editingFieldId) {
      const updatedFields = editingForm.fields.map((field) =>
        field.id === editingFieldId ? { ...field, label: tempFieldLabel, placeholder: tempFieldPlaceholder } : field
      );
      setEditingForm({ ...editingForm, fields: updatedFields });
      setEditingFieldId(null);
    }
  };

  // Handle deleting a field
  const handleDeleteField = (fieldId: string) => {
    if (editingForm) {
      const newFields = editingForm.fields.filter((field) => field.id !== fieldId);
      setEditingForm({ ...editingForm, fields: newFields });
    }
  };

  // Create a new form
  const createNewForm = () => {
    if (!formName.trim()) return;

    const newForm = { id: `${Date.now()}`, name: formName, fields: [] };
    setEditingForm(newForm);
    setFormName('');
  };

  // Cancel form creation
  const cancelFormCreation = () => {
    setEditingForm(null);
  };

  // Save the form to the database
  const saveForm = async () => {
    if (editingForm) {
      try {
        const savedForm = await createForm({ name: editingForm.name, fields: editingForm.fields });
        setForms((prevForms) => [...prevForms, savedForm]);
        setEditingForm(null);
      } catch (error) {
        console.error('Error saving form:', error);
      }
    }
  };

  // Delete a form
  const deleteExistingForm = async (formId: string) => {
    try {
      await deleteForm(formId);
      setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
    } catch (error) {
      console.error(`Error deleting form with ID ${formId}:`, error);
    }
  };

  // Fetch forms when the component mounts
  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const fetchedForms = await fetchForms();
        setForms(fetchedForms);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };
    fetchAllForms();
  }, []);

  return (
    <div className={styles.builderContainer}>
      <h1>Form Builder</h1>
      {editingForm ? (
        <div className={styles.editingContainer}>
          <h2>Editing: {editingForm.name}</h2>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {/* Field Options */}
            <div className={styles.optionsContainer}>
              <h3>Field Options</h3>
              {initialFieldOptions.map((option) => (
                <DraggableField key={option.id} field={option} />
              ))}
            </div>

            {/* Droppable Area */}
            <DroppableArea
              fields={editingForm.fields}
              onDeleteField={handleDeleteField}
              onEditField={handleEditField}
              editingFieldId={editingFieldId}
              onFieldUpdate={handleSaveField}
              tempLabel={tempFieldLabel}
              tempPlaceholder={tempFieldPlaceholder}
              setTempLabel={setTempFieldLabel}
              setTempPlaceholder={setTempFieldPlaceholder}
            />
          </DndContext>
          <div className={styles.actionButtons}>
            <button onClick={saveForm} className={styles.doneButton}>Done</button>
            <button onClick={cancelFormCreation} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <button onClick={createNewForm} className={styles.createButton}>Create Form</button>

          {forms.length === 0 ? (
            <p>No forms created. Start by creating a form.</p>
          ) : (
            forms.map((form) => (
              <div key={form.id} className={styles.formContainer}>
                <div className={styles.formHeader}>
                  <h2>{form.name}</h2>
                  <button onClick={() => deleteExistingForm(form.id)} className={styles.deleteButton}>Delete Form</button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

// DraggableField Component
const DraggableField = ({ field }: { field: Field }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: field.id,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: transition || undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles.fieldOption}
    >
      {field.label}
    </div>
  );
};

// DroppableArea Component
const DroppableArea = ({
  fields,
  onDeleteField,
  onEditField,
  editingFieldId,
  onFieldUpdate,
  tempLabel,
  tempPlaceholder,
  setTempLabel,
  setTempPlaceholder,
}: {
  fields: Field[];
  onDeleteField: (id: string) => void;
  onEditField: (id: string) => void;
  editingFieldId: string | null;
  onFieldUpdate: () => void;
  tempLabel: string;
  tempPlaceholder: string;
  setTempLabel: (label: string) => void;
  setTempPlaceholder: (placeholder: string) => void;
}) => {
  const { setNodeRef } = useDroppable({ id: 'droppable' });

  return (
    <div ref={setNodeRef} className={styles.formCanvas}>
      <h3>Form Canvas</h3>
      {fields.length === 0 ? (
        <p>No fields added. Drag and drop fields here.</p>
      ) : (
        fields.map((field) => (
          <div key={field.id} className={styles.formField}>
            {editingFieldId === field.id ? (
              <div className={styles.editFieldContainer}>
                <input
                  type="text"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                  placeholder="Field Label"
                />
                <input
                  type="text"
                  value={tempPlaceholder}
                  onChange={(e) => setTempPlaceholder(e.target.value)}
                  placeholder="Placeholder"
                />
                <button onClick={onFieldUpdate} className={styles.doneButton}>Save</button>
              </div>
            ) : (
              <>
                <label>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} />
                <div className={styles.fieldActions}>
                  <button onClick={() => onEditField(field.id)} className={styles.editButton}>Edit</button>
                  <button onClick={() => onDeleteField(field.id)} className={styles.deleteButton}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};