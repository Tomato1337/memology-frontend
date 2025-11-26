import { getUserProfile } from "@/shared/api"
import { useQuery } from "@tanstack/react-query"

export const useGetUser = () => {
	return useQuery({
		queryKey: ["user"],
		retry: 1,
		queryFn: async () => {
			const { data } = await getUserProfile()
			return data
		},
	})
}
