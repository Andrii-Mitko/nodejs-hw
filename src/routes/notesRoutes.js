import { Router } from 'express';
import {
  createNote,
  getNoteById,
  getAllNotes,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import { celebrate } from 'celebrate';
import {
  createAllNoteSchema,
  noteIdParamSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get('/notes', getAllNotes);
router.get('/notes/:noteId', celebrate(noteIdParamSchema), getNoteById);
router.post('/notes', celebrate(createAllNoteSchema), createNote);
router.delete('/notes/:noteId', celebrate(noteIdParamSchema), deleteNote);
router.patch('/notes/:noteId', updateNote);

export default router;
