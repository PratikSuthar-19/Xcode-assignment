import Joi from 'joi';

export const createMediaSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    type: Joi.string().valid('MOVIE', 'TVSHOW').required(),
    director: Joi.string().allow('', null),
    budget: Joi.string().allow('', null),
    location: Joi.string().allow('', null),
    duration: Joi.string().allow('', null),
    yearOrTime: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    posterUrl: Joi.string().uri().allow('', null),
  }).required(),
});

export const updateMediaSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().required(),
  }).required(),
  body: Joi.object({
    title: Joi.string().optional(),
    type: Joi.string().valid('MOVIE', 'TVSHOW').optional(),
    director: Joi.string().optional().allow('', null),
    budget: Joi.string().optional().allow('', null),
    location: Joi.string().optional().allow('', null),
    duration: Joi.string().optional().allow('', null),
    yearOrTime: Joi.string().optional().allow('', null),
    description: Joi.string().optional().allow('', null),
    posterUrl: Joi.string().uri().optional().allow('', null),
  }).required(),
});

export const paginationSchema = Joi.object({
  query: Joi.object({
    cursor: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(100).optional().default(20),
    type: Joi.string().valid('MOVIE', 'TVSHOW').optional(),
    search: Joi.string().optional(),
  }).required(),
});
