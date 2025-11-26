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
		<Button
			className="cursor-pointer"
			onClick={() => navigate.push("/auth/login")}
		>
			<User2Icon className="size-4" />
			<span className="font-montserrat text-md font-medium group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:p-0">
				Войти
			</span>
		</Button>
	) : (
		<div className="flex w-full items-center justify-between gap-4 border-t-2 border-white/10 p-3 group-data-[collapsible=icon]:justify-center">
			{!isLoading && data ? (
				<Avatar className="size-8 flex-shrink-0">
					<AvatarFallback className="bg-primary">
						{data?.username.slice(0, 2)}
					</AvatarFallback>
				</Avatar>
			) : (
				<Skeleton className="size-7" />
			)}
			{!isLoading && data ? (
				<div className="flex min-w-0 flex-1 flex-col justify-center group-data-[collapsible=icon]:hidden">
					<h3 className="truncate text-xs font-bold">
						{data?.username}
					</h3>
				</div>
			) : (
				<Skeleton className="h-4 w-full flex-1 rounded group-data-[collapsible=icon]:hidden" />
			)}
			<LogOutIcon
				onClick={() => {
					logoutUser.mutate(void 0, {
						onSuccess: () => {
							customToast("Logged out successfully", "success")
							navigate.push("/auth/login")
							navigate.refresh()
						},
					})
				}}
				className="block size-6 flex-shrink-0 cursor-pointer text-white transition-all duration-200 group-data-[collapsible=icon]:hidden hover:scale-105"
			/>
		</div>
	)
}
