import { getUserProfile } from "@/shared/api"
import { useQuery } from "@tanstack/react-query"

export const useGetUser = () => {
	// const token = localStorage.getItem("access_token")

	return useQuery({
		queryKey: ["user"],
		// enabled: !!token,
		retry: false,
		queryFn: async () => {
			const { data } = await getUserProfile()
			return data
		},
	})
}
