import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';

// Рядок рівно з 24 hex-символів
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Для маршрутів GET, DELETE, PATCH /notes/:noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string()
      .pattern(objectIdPattern)
      .message('Invalid noteId format')
      .required(),
  }),
};

// Для маршруту GET /notes
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().allow(''),
  }),
};

// Для маршруту POST /notes
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
};

// Для маршруту PATCH /notes/:noteId
export const updateNoteSchema = {
  [Segments.PARAMS]: noteIdSchema[Segments.PARAMS],

  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).optional(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }).min(1),
};
