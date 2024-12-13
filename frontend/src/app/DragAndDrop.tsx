import React from "react";
import {
  DndContext,
  useDraggable,
  DragEndEvent,
} from "@dnd-kit/core";

type Field = {
  id: string;
  label: string;
  type: string;
};

interface DragAndDropProps {
  fields: Field[];
  setFields: (fields: Field[]) => void;
}

const DragAndDrop = ({ fields, setFields }: DragAndDropProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active?.id && over?.id && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex >= 0 && newIndex >= 0) {
        const updatedFields = [...fields];
        const [movedField] = updatedFields.splice(oldIndex, 1);
        updatedFields.splice(newIndex, 0, movedField);
        setFields(updatedFields);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="form-fields">
        {fields.map((field) => (
          <DraggableField key={field.id} id={field.id} label={field.label} />
        ))}
      </div>
    </DndContext>
  );
};

interface DraggableFieldProps {
  id: string;
  label: string;
}

const DraggableField = ({ id, label }: DraggableFieldProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="draggable-field p-2 border rounded bg-white shadow mb-2"
    >
      {label}
    </div>
  );
};

export default DragAndDrop;
