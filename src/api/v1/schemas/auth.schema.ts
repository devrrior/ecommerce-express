import { z } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateTokensInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
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
 *    CreateTokensResponse:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *          description: Access token
 *          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *        refreshToken:
 *          type: string
 *          description: Refresh token
 *          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 */
export const CreateTokensSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .min(1)
      .email('Not a valid email'),
    password: z.string({ required_error: 'Password is required' }).min(1),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    RefreshTokensInput:
 *      type: object
 *      required:
 *        - refreshToken
 *      properties:
 *        refreshToken:
 *          type: string
 *          description: Refresh token
 *          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 */
export const RefreshTokensSchema = z.object({
  body: z.object({
    refresh: z.string({ required_error: 'Refresh token is required' }).min(1),
  }),
});

export type CreateTokensType = z.infer<typeof CreateTokensSchema>['body'];
export type RefreshTokensType = z.infer<typeof RefreshTokensSchema>['body'];
