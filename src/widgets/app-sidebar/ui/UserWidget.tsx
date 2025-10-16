import { userQueries } from "@/entities/user"
import { customToast } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { LogOutIcon, User2Icon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UserWidget() {
	const { data, isLoading, error } = userQueries.useGetUser()
	const navigate = useRouter()
	const logoutUser = userQueries.useLogoutUser()

	return error && !data ? (
		<Button onClick={() => navigate.push("/auth/login")}>
			<User2Icon className="mr-2 size-4" />
		</Button>
	) : (
		<div className="flex w-full items-center justify-between gap-4 border-t-2 border-white/10 p-4">
			{!isLoading && data ? (
				<Avatar className="size-6 flex-shrink-0">
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			) : (
				<Skeleton className="size-6" />
			)}
			{!isLoading && data ? (
				<div className="flex min-w-0 flex-1 flex-col justify-center">
					<h3 className="truncate text-xs font-bold">
						{data?.username}
					</h3>
				</div>
			) : (
				<Skeleton className="h-4 w-full flex-1 rounded" />
			)}
			<LogOutIcon
				onClick={() => {
					logoutUser.mutate(void 0, {
						onSuccess: () => {
							customToast("Logged out successfully", "success")
						},
					})
				}}
				className="block size-6 flex-shrink-0 cursor-pointer text-white"
			/>
		</div>
	)
}
