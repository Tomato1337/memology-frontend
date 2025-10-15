import z from "zod"

export const loginSchema = z.object({
	emailOrUsername: z.email({ message: "Enter a valid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
})
export type LoginForm = z.infer<typeof loginSchema>
