import { z } from 'zod';

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
