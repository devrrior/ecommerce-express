import { z } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateCategoryInput:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the category
 *          example: "Clothes"
 *
 *    CreateCategoryResponse:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the category
 *          example: "Clothes"
 */

export const CreateCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(1, 'Name must be at least 1 character long'),
  }),
});

export const CategoryNameSchema = z.object({
  params: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name must be at least 1 character long'),
  }),
});

export const UpdateCategorySchema = z.object({
  params: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name must be at least 1 character long'),
  }),
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(1, 'Name must be at least 1 character long'),
  }),
});

export type CreateCategoryBodyType = z.infer<
  typeof CreateCategorySchema
>['body'];
export type CategoryNameParamsType = z.infer<
  typeof CategoryNameSchema
>['params'];
export type UpdateCategoryBodyType = z.infer<
  typeof UpdateCategorySchema
>['body'];
export type UpdateCategoryParamsType = z.infer<
  typeof UpdateCategorySchema
>['params'];
