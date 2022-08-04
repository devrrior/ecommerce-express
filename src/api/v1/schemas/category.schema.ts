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
      .min(1),
  }),
});

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>['body'];
