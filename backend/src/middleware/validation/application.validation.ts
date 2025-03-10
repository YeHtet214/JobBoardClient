import { body, param } from 'express-validator';

/**
 * Validation rules for application endpoints
 */
export const applicationValidation = {
  // Validation for creating a new application
  create: [
    param('jobId')
      .notEmpty().withMessage('Job ID is required')
      .isString().withMessage('Job ID must be a string')
      .trim()
      .escape(),
    body('resumeUrl')
      .notEmpty().withMessage('Resume URL is required')
      .isURL().withMessage('Resume URL must be a valid URL')
      .trim(),
    body('coverLetter')
      .notEmpty().withMessage('Cover letter is required')
      .isString().withMessage('Cover letter must be a string')
      .trim()
      .escape()
  ],
  
  // Validation for updating an application
  update: [
    param('id')
      .notEmpty().withMessage('Application ID is required')
      .isString().withMessage('Application ID must be a string')
      .trim()
      .escape(),
    body('resumeUrl')
      .optional()
      .isURL().withMessage('Resume URL must be a valid URL')
      .trim(),
    body('coverLetter')
      .optional()
      .isString().withMessage('Cover letter must be a string')
      .trim()
      .escape()
  ],

   // Validation for getting an application by ID
   getByJobId: [
    param('jobId')
      .notEmpty().withMessage('Application ID is required')
      .isString().withMessage('Application ID must be a string')
      .trim()
      .escape()
  ],
  
  // Validation for getting an application by ID
  getById: [
    param('id')
      .notEmpty().withMessage('Application ID is required')
      .isString().withMessage('Application ID must be a string')
      .trim()
      .escape()
  ],
  
  // Validation for deleting an application
  delete: [
    param('id')
      .notEmpty().withMessage('Application ID is required')
      .isString().withMessage('Application ID must be a string')
      .trim()
      .escape()
  ]
};
