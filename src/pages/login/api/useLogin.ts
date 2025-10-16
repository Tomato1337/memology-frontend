import { LoginRequest, loginUser } from "@/shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useLogin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ["login"],
		mutationFn: async (body: LoginRequest) => {
			const { data, error } = await loginUser(body)

			if (error) {
				throw new Error(
					error.error || "Login failed. Please try again.",
				)
			}

			return data
		},
		onSuccess: (authResponse) => {
			if (authResponse?.user) {
				queryClient.setQueryData(["user"], authResponse.user)
			}
		},
	})
}
