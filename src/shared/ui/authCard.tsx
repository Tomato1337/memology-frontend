import { Card } from "@/shared/ui/card"
import { cn } from "../lib/utils"
import Logo from "./logo"

export default function AuthCard({
	isRegister = false,
}: {
	isRegister?: boolean
}) {
	return (
		<div
			className={cn(
				"hidden items-center justify-center p-12 lg:flex lg:w-1/2 lg:justify-end",
				{
					"lg:justify-start": isRegister,
				},
			)}
		>
			<Card
				className="bg-background flex w-full max-w-md flex-col justify-between gap-3 rounded-3xl border-3 p-4 text-white"
				style={{
					width: "clamp(200px, 50vh, 500px)",
				}}
			>
				<div className="from-primary to-secondary-foreground dark:from-primary dark:to-secondary flex h-full flex-3 flex-col justify-end rounded-2xl bg-gradient-to-br p-4 dark:border">
					{/* <CircleIcon className="size-20" /> */}
					<div className="space-y-6">
						<h2 className="font-pixelify-sans text-4xl font-normal tracking-widest md:text-5xl">
							Думай
							<br />
							Генерируй
							<br />
							Смеши
						</h2>
					</div>
					<div className="flex items-center justify-between">
						{/* <MedicineIcon className="size-24 animate-spin [animation-duration:12s]" />
						<StarIcon className="size-24" /> */}
					</div>
				</div>

				<div className="font-pixelify-sans text-primary flex items-center gap-3 text-4xl font-extrabold dark:text-white">
					<Logo className="fill-accent size-10 dark:fill-white" />
					<h2>MemoLogy</h2>
				</div>
			</Card>
		</div>
	)
}
