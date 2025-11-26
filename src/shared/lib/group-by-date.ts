import { IMemeDTO } from "@/entities/meme"

export interface GroupedMemes {
	label: string
	memes: IMemeDTO[]
}

/**
 * Группирует мемы по дате создания
 * @param memes - массив мемов
 * @returns массив групп с метками (Сегодня, Вчера, и т.д.)
 */
export function groupMemesByDate(memes: IMemeDTO[]): GroupedMemes[] {
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)
	const thisWeekStart = new Date(today)
	thisWeekStart.setDate(thisWeekStart.getDate() - 7)
	const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

	const groups = {
		today: [] as IMemeDTO[],
		yesterday: [] as IMemeDTO[],
		thisWeek: [] as IMemeDTO[],
		thisMonth: [] as IMemeDTO[],
		older: [] as IMemeDTO[],
	}

	memes.forEach((meme) => {
		const memeDate = new Date(meme.createdAt)
		const memeDateOnly = new Date(
			memeDate.getFullYear(),
			memeDate.getMonth(),
			memeDate.getDate(),
		)

		if (memeDateOnly.getTime() === today.getTime()) {
			groups.today.push(meme)
		} else if (memeDateOnly.getTime() === yesterday.getTime()) {
			groups.yesterday.push(meme)
		} else if (memeDate >= thisWeekStart) {
			groups.thisWeek.push(meme)
		} else if (memeDate >= thisMonthStart) {
			groups.thisMonth.push(meme)
		} else {
			groups.older.push(meme)
		}
	})

	const result: GroupedMemes[] = []

	if (groups.today.length > 0) {
		result.push({ label: "Сегодня", memes: groups.today })
	}
	if (groups.yesterday.length > 0) {
		result.push({ label: "Вчера", memes: groups.yesterday })
	}
	if (groups.thisWeek.length > 0) {
		result.push({ label: "На этой неделе", memes: groups.thisWeek })
	}
	if (groups.thisMonth.length > 0) {
		result.push({ label: "В этом месяце", memes: groups.thisMonth })
	}
	if (groups.older.length > 0) {
		result.push({ label: "Ранее", memes: groups.older })
	}

	return result
}
