import { http, HttpResponse, delay } from "msw"
import { faker } from "@faker-js/faker"
import { API_ROUTES } from "@/shared/config/routes"
import type {
	Meme,
	MemeListResponse,
	CreateMemeDto,
	GenerateMemeDto,
} from "@/entities/meme/model/meme.types"

// Установим seed для воспроизводимости
faker.seed(123)

/**
 * Генерация фейкового мема
 */
function generateMeme(): Meme {
	// Используем picsum.photos вместо loremflickr
	const width = faker.number.int({ min: 400, max: 1200 })
	const height = faker.number.int({ min: 400, max: 1200 })
	const imageUrl = `https://picsum.photos/${width}/${height}?random=${faker.string.uuid()}`

	return {
		id: faker.string.uuid(),
		title: faker.lorem.sentence({ min: 3, max: 6 }),
		imageUrl,
		width,
		height,
		description: faker.lorem.paragraph(),
		author: {
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			avatar: `https://i.pravatar.cc/150?img=${faker.number.int({
				min: 1,
				max: 70,
			})}`,
		},
		tags: faker.helpers.arrayElements(
			[
				"funny",
				"cats",
				"programming",
				"wholesome",
				"dark",
				"sarcastic",
				"relatable",
			],
			{ min: 1, max: 4 },
		),
		likes: faker.number.int({ min: 0, max: 10000 }),
		views: faker.number.int({ min: 0, max: 50000 }),
		createdAt: faker.date.past({ years: 1 }).toISOString(),
		updatedAt: faker.date.recent({ days: 30 }).toISOString(),
	}
}

// Генерируем фейковые данные
const memes: Meme[] = faker.helpers.multiple(() => generateMeme(), {
	count: 300,
})

/**
 * Обработчики для API мемов
 *
 * NOTE: Auth и Users эндпоинты НЕ мокируются здесь!
 * Они идут напрямую на реальный бэкенд через typedApiClient
 * Здесь только моки для мемов и других пока не готовых эндпоинтов
 */
export const handlers = [
	// Получить список мемов
	http.get(API_ROUTES.MEMES.LIST, async ({ request }) => {
		await delay(300) // Имитация задержки сети

		const url = new URL(request.url)
		const page = parseInt(url.searchParams.get("page") || "1")
		const pageSize = parseInt(url.searchParams.get("pageSize") || "10")
		const search = url.searchParams.get("search") || ""

		let filteredMemes = memes

		// Фильтрация по поиску
		if (search) {
			filteredMemes = memes.filter(
				(meme) =>
					meme.title.toLowerCase().includes(search.toLowerCase()) ||
					meme.description
						?.toLowerCase()
						.includes(search.toLowerCase()),
			)
		}

		const start = (page - 1) * pageSize
		const end = start + pageSize
		const paginatedMemes = filteredMemes.slice(start, end)

		const response: MemeListResponse = {
			data: paginatedMemes,
			total: filteredMemes.length,
			page,
			pageSize,
		}

		return HttpResponse.json(response)
	}),

	// Получить мем по ID
	http.get("/api/memes/:id", async ({ params }) => {
		await delay(200)

		const { id } = params
		const meme = memes.find((m) => m.id === id)

		if (!meme) {
			return HttpResponse.json(
				{ message: "Мем не найден" },
				{ status: 404 },
			)
		}

		return HttpResponse.json(meme)
	}),

	// Создать новый мем
	http.post(API_ROUTES.MEMES.CREATE, async ({ request }) => {
		await delay(500)

		const data = (await request.json()) as CreateMemeDto

		const width = 800
		const height = 600

		const newMeme: Meme = {
			id: faker.string.uuid(),
			title: data.title,
			imageUrl: data.imageUrl,
			width,
			height,
			description: data.description,
			author: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				avatar: `https://i.pravatar.cc/150?img=${faker.number.int({
					min: 1,
					max: 70,
				})}`,
			},
			tags: data.tags || [],
			likes: 0,
			views: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		memes.unshift(newMeme)

		return HttpResponse.json(newMeme, { status: 201 })
	}),

	// Обновить мем
	http.patch("/api/memes/:id", async ({ params, request }) => {
		await delay(300)

		const { id } = params
		const data = (await request.json()) as Partial<Meme>
		const memeIndex = memes.findIndex((m) => m.id === id)

		if (memeIndex === -1) {
			return HttpResponse.json(
				{ message: "Мем не найден" },
				{ status: 404 },
			)
		}

		memes[memeIndex] = {
			...memes[memeIndex],
			...data,
			updatedAt: new Date().toISOString(),
		}

		return HttpResponse.json(memes[memeIndex])
	}),

	// Удалить мем
	http.delete("/api/memes/:id", async ({ params }) => {
		await delay(200)

		const { id } = params
		const memeIndex = memes.findIndex((m) => m.id === id)

		if (memeIndex === -1) {
			return HttpResponse.json(
				{ message: "Мем не найден" },
				{ status: 404 },
			)
		}

		memes.splice(memeIndex, 1)

		return new HttpResponse(null, { status: 204 })
	}),

	// Генерация мема с помощью AI (имитация)
	http.post(API_ROUTES.MEMES.GENERATE, async ({ request }) => {
		await delay(2000) // Имитация длительной генерации

		const data = (await request.json()) as GenerateMemeDto

		const width = 800
		const height = 600

		const generatedMeme: Meme = {
			id: faker.string.uuid(),
			title: `AI Generated: ${data.prompt}`,
			imageUrl: `https://picsum.photos/${width}/${height}?random=${faker.string.uuid()}`,
			width,
			height,
			description: `Сгенерировано AI на основе: "${data.prompt}"`,
			author: {
				id: "ai-bot",
				name: "AI Meme Generator",
				avatar: `https://i.pravatar.cc/150?img=${faker.number.int({
					min: 1,
					max: 70,
				})}`,
			},
			tags: ["ai-generated", data.style || "funny"],
			likes: 0,
			views: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		memes.unshift(generatedMeme)

		return HttpResponse.json(generatedMeme, { status: 201 })
	}),

	// NOTE: Auth и Users эндпоинты НЕ мокируются!
	// Они обрабатываются напрямую через typedApiClient к реальному бэкенду
	// См. src/shared/api/typed-client.ts и src/shared/api/config.ts
]
