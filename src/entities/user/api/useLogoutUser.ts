import { logoutUser } from "@/shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useLogoutUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ["logout"],
		mutationFn: async () => {
			const { data } = await logoutUser()
			return data
		},
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["user"] })
		},
	})
}
