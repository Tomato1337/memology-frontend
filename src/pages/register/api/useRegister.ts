import { RegisterRequest, registerUser } from "@/shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useRegister = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ["register"],
		mutationFn: async (body: RegisterRequest) => {
			const { data } = await registerUser(body)
			return data
		},
		onSuccess: (authResponse) => {
			// Сохраняем данные пользователя в кэш
			if (authResponse?.user) {
				queryClient.setQueryData(["user"], authResponse.user)
			}
			if (authResponse?.access_token) {
				localStorage.setItem("access_token", authResponse.access_token)
			}
		},
	})
}
