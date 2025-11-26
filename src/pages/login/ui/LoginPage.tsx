"use client"

import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldGroup } from "@/shared/ui/field"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import InputLabel from "@/shared/ui/inputLabel"
import { useLogin } from "../api/useLogin"
import { customToast } from "@/shared/lib/utils"
import { LoginForm, loginSchema } from "../model/login.model"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthCard from "@/shared/ui/authCard"

export default function LoginPage() {
	const navigate = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors, dirtyFields },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			emailOrUsername: "",
			password: "",
		},
	})

	const mutateLogin = useLogin()

	const onSubmit = (data: LoginForm) => {
		const fetchData = {
			username: data.emailOrUsername,
			password: data.password,
		}
		mutateLogin.mutate(fetchData, {
			onSuccess: (data) => {
				customToast("Login successful!", "success")
				console.log("Login success:", data)
				navigate.replace("/")
				navigate.refresh()
			},
		})
	}

	console.log(dirtyFields)

	return (
		<div className="flex h-full items-center justify-center">
			<AuthCard />

			{/* Right Side - Form */}
			<div className="flex flex-1 items-center justify-center p-6 lg:justify-start lg:p-12">
				<div className="w-full max-w-md space-y-8">
					<div className="space-y-2 text-center">
						<h1 className="font-pixelify text-4xl font-bold">
							Welcome Back
						</h1>
						<p className="text-muted-foreground">
							Log in to access your meme dashboard
						</p>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FieldGroup className="gap-4">
							<Field data-invalid={!!errors.emailOrUsername}>
								<div className="relative">
									<InputLabel
										type="email"
										placeholder=" "
										aria-invalid={!!errors.emailOrUsername}
										className="peer pt-6"
										label="Email"
										{...register("emailOrUsername")}
									/>
								</div>
								{errors.emailOrUsername && (
									<FieldError>
										{errors.emailOrUsername.message}
									</FieldError>
								)}
							</Field>

							<Field data-invalid={!!errors.password}>
								<div className="relative">
									<InputLabel
										type="password"
										placeholder=" "
										aria-invalid={!!errors.password}
										className="peer pt-6"
										label="Password"
										{...register("password")}
									/>
								</div>
								{errors.password && (
									<FieldError>
										{errors.password.message}
									</FieldError>
								)}
							</Field>
						</FieldGroup>

						<Button
							type="submit"
							className="bg-primary hover:bg-primary/90 h-12 w-full rounded-xl text-lg font-semibold text-white"
							disabled={mutateLogin.isPending}
						>
							{mutateLogin.isPending ? "Logging in..." : "Login"}
						</Button>

						<div className="flex items-center justify-center gap-2 pt-4">
							<hr className="border-muted-foreground flex-1 border-t-2" />
							<span className="text-muted-foreground text-sm">
								Doesn't have an account?
							</span>
							<Link
								href="/auth/register"
								className="hover:text-primary text-secondary-foreground text-sm font-semibold underline transition-colors duration-200"
							>
								Register
							</Link>
							<hr className="border-muted-foreground flex-1 border-t-2" />
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
