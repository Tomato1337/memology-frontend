// Next.js App Router page - thin wrapper over FSD structure
import CreateMemePage from "@/pages/create-meme"

export const metadata = {
	title: "Создать мем - AI Meme Generator",
	description: "Создавай уникальные мемы с помощью искусственного интеллекта",
}

export default function CreatePage() {
	return <CreateMemePage />
}
