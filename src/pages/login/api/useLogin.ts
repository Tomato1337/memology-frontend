import {
	LoginRequest,
	loginUser,
	RegisterRequest,
	registerUser,
} from "@/shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useLogin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ["login"],
		mutationFn: async (body: LoginRequest) => {
			const { data } = await loginUser(body)
			return data
		},
		onSuccess: (authResponse) => {
			if (authResponse?.user) {
				queryClient.setQueryData(["user"], authResponse.user)
			}
		},
	})
}
