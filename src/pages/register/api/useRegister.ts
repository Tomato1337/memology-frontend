import { RegisterRequest, registerUser } from "@/shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useRegister = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ["register"],
		mutationFn: async (body: RegisterRequest) => {
			const { data, error } = await registerUser(body)

			if (error) {
				throw new Error(
					error.error || "Login failed. Please try again.",
				)
			}

			return data
		},
		onSuccess: (authResponse) => {
			// Сохраняем данные пользователя в кэш
			if (authResponse?.user) {
				queryClient.setQueryData(["user"], authResponse.user)
			}
		},
	})
}
