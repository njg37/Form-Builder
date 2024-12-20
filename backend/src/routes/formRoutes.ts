import express, { Request, Response, NextFunction } from 'express';
import Form from '../models/Form';

const router = express.Router();

// Utility function to handle async errors
const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Get all forms
router.get(
  '/forms',
  asyncHandler(async (req: Request, res: Response) => {
    const forms = await Form.findAll();
    res.json(forms);
  })
);

// Create a new form
router.post(
  '/forms',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, fields } = req.body;
    const form = await Form.create({ name, fields });
    res.status(201).json(form);
  })
);

// Update a form
router.put(
  '/forms/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, fields } = req.body;
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    await form.update({ name, fields });
    res.json(form);
  })
);

// Delete a form
router.delete(
  '/forms/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    await form.destroy();
    res.json({ message: 'Form deleted successfully' });
  })
);

// Get preview of a form (can be used to show a specific form's details or fields)
// Get preview of a form (assuming formId is passed as query param)
router.get(
  '/preview',
  asyncHandler(async (req: Request, res: Response) => {
    const { formId } = req.query;  // Assuming you're passing the formId in the query string

    if (!formId) {
      return res.status(400).json({ error: 'Form ID is required' });
    }

    const form = await Form.findByPk(formId as string);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);  // Send form data back in response
  })
);


export default router;
