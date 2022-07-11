import { z } from 'zod';

export const CreateTokensSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .min(1)
      .email('Not a valid email'),
    password: z.string({ required_error: 'Password is required' }).min(1),
  }),
});

export type CreateTokensType = z.infer<typeof CreateTokensSchema>['body'];
