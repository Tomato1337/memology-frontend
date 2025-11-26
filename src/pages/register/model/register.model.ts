import z from "zod"

export const registerSchema = z
	.object({
		username: z
			.string()
			.min(2, { message: "Username must be at least 2 characters" }),
		email: z.email({ message: "Enter a valid email address" }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})

export type RegisterForm = z.infer<typeof registerSchema>
