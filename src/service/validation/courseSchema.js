import { checkSchema } from 'express-validator';


export const validationMiddleware = checkSchema({

    title: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'Title is required',

    },

    description: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'Description is required',

    }
   
  });