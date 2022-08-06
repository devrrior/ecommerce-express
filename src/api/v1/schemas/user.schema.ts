import { z } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        firstName:
 *          type: string
 *          description: First name of the user
 *          example: "Marco"
 *          required_error: First name is required
 *        lastName:
 *          type: string
 *          description: Last name of the user
 *          example: "Polo"
 *          required_error: Last name is required
 *        email:
 *          type: string
 *          description: Email of the user
 *          example: marco@email.com
 *          required_error: Email is required
 *        password:
 *          type: string
 *          description: Password of the user
 *          example: password
 *          required_error: Password is required
 *        passwordConfirmation:
 *          type: string
 *          description: Password confirmation of the user
 *          example: password
 *          required_error: Password confirmation is required
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: Id of the user
 *          example: 507f191e810c19729de860ea
 *        firstName:
 *          type: string
 *          description: First name of the user
 *          example: "Marco"
 *        lastName:
 *          type: string
 *          description: Last name of the user
 *          example: "Polo"
 *        email:
 *          type: string
 *          description: Email of the user
 *          example: marco@email.com
 *        role:
 *          type: string
 *          description: Role of the user
 *          example: "customer"
 *        createdAt:
 *          type: string
 *          description: Date of creation of the user
 *          example: "2020-01-01T00:00:00.000Z"
 *        updatedAt:
 *          type: string
 *          description: Date of last update of the user
 *          example: "2020-01-01T00:00:00.000Z"
 */
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

export const UserIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Id is required' }).length(24, 'Invalid id'),
  }),
});

export const UpdateUserSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Id is required' }).length(24, 'Invalid id'),
  }),
  body: z.object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(1, `Empty field is not valid`)
      .optional(),
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(1, `Empty field is not valid`)
      .optional(),
  }),
});

export type CreateUserBodyType = z.infer<typeof CreateUserSchema>['body'];
export type UserIdParamsType = z.infer<typeof UserIdSchema>['params'];
export type UpdateUserBodyType = z.infer<typeof UpdateUserSchema>['body'];
export type UpdateUserParamsType = z.infer<typeof UpdateUserSchema>['params'];
