import { z } from 'zod';

export const CreateUserSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Not a valid email'),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password is too shor - Should be min 6 chars'),
      passwordConfirmation: z.string({
        required_error: 'Password is required',
      }),
      firstName: z
        .string({ required_error: 'First name is required' })
        .min(1, `Empty field is not valid`),
      lastName: z
        .string({ required_error: 'Last name is required' })
        .min(1, `Empty field is not valid`),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Password do not match',
      path: ['passwordConfirmation'],
    }),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>['body'];
