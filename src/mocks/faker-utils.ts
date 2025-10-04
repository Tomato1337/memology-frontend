/**
 * Примеры использования Faker.js для генерации фейковых данных
 *
 * Этот файл содержит утилиты и примеры для создания тестовых данных
 */

import { faker } from '@faker-js/faker'

// Установим seed для воспроизводимых результатов (опционально)
// faker.seed(123);

/**
 * Генерация пользователя
 */
export function generateUser() {
    return {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: `https://i.pravatar.cc/150?img=${faker.number.int({
            min: 1,
            max: 70,
        })}`,
        bio: faker.lorem.paragraph(),
        website: faker.internet.url(),
        location: faker.location.city(),
        createdAt: faker.date.past({ years: 2 }).toISOString(),
    }
}

/**
 * Генерация комментария
 */
export function generateComment() {
    return {
        id: faker.string.uuid(),
        author: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            avatar: `https://i.pravatar.cc/150?img=${faker.number.int({
                min: 1,
                max: 70,
            })}`,
        },
        text: faker.lorem.sentences({ min: 1, max: 3 }),
        likes: faker.number.int({ min: 0, max: 500 }),
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
    }
}

/**
 * Генерация тега
 */
export function generateTag() {
    const tags = [
        'funny',
        'cats',
        'dogs',
        'programming',
        'wholesome',
        'dark',
        'sarcastic',
        'relatable',
        'anime',
        'gaming',
        'movies',
        'tv-shows',
        'music',
        'sports',
        'politics',
    ]

    return faker.helpers.arrayElement(tags)
}

/**
 * Генерация уникального набора тегов
 */
export function generateTags(count: number = 3) {
    const allTags = [
        'funny',
        'cats',
        'dogs',
        'programming',
        'wholesome',
        'dark',
        'sarcastic',
        'relatable',
        'anime',
        'gaming',
        'movies',
        'tv-shows',
        'music',
        'sports',
        'politics',
    ]

    return faker.helpers.arrayElements(allTags, { min: 1, max: count })
}

/**
 * Генерация массива элементов
 */
export function generateArray<T>(generator: () => T, count: number = 5): T[] {
    return faker.helpers.multiple(generator, { count })
}

/**
 * Примеры использования различных методов Faker.js
 */
export const fakerExamples = {
    // Личные данные
    person: {
        fullName: () => faker.person.fullName(),
        firstName: () => faker.person.firstName(),
        lastName: () => faker.person.lastName(),
        bio: () => faker.person.bio(),
        jobTitle: () => faker.person.jobTitle(),
    },

    // Интернет
    internet: {
        email: () => faker.internet.email(),
        url: () => faker.internet.url(),
        username: () => faker.internet.username(),
        password: () => faker.internet.password(),
        emoji: () => faker.internet.emoji(),
    },

    // Изображения
    image: {
        avatar: () =>
            `https://i.pravatar.cc/150?img=${faker.number.int({
                min: 1,
                max: 70,
            })}`,
        url: () =>
            `https://picsum.photos/${faker.number.int({
                min: 400,
                max: 1200,
            })}/${faker.number.int({ min: 400, max: 1200 })}`,
        placeholder: () =>
            `https://via.placeholder.com/800x600/${faker.color
                .rgb({ format: 'hex', casing: 'lower' })
                .slice(1)}`,
    },

    // Текст
    lorem: {
        word: () => faker.lorem.word(),
        words: () => faker.lorem.words(5),
        sentence: () => faker.lorem.sentence(),
        paragraph: () => faker.lorem.paragraph(),
        paragraphs: () => faker.lorem.paragraphs(3),
    },

    // Числа
    number: {
        int: () => faker.number.int({ min: 0, max: 100 }),
        float: () =>
            faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
        bigInt: () => faker.number.bigInt(),
    },

    // Даты
    date: {
        past: () => faker.date.past({ years: 1 }),
        future: () => faker.date.future({ years: 1 }),
        recent: () => faker.date.recent({ days: 7 }),
        soon: () => faker.date.soon({ days: 7 }),
        between: () =>
            faker.date.between({
                from: '2024-01-01',
                to: '2024-12-31',
            }),
    },

    // Локации
    location: {
        city: () => faker.location.city(),
        country: () => faker.location.country(),
        streetAddress: () => faker.location.streetAddress(),
        latitude: () => faker.location.latitude(),
        longitude: () => faker.location.longitude(),
    },

    // UUID и строки
    string: {
        uuid: () => faker.string.uuid(),
        alphanumeric: () => faker.string.alphanumeric(10),
        hexadecimal: () => faker.string.hexadecimal({ length: 8 }),
    },

    // Помощники
    helpers: {
        arrayElement: () => faker.helpers.arrayElement(['a', 'b', 'c']),
        arrayElements: () =>
            faker.helpers.arrayElements([1, 2, 3, 4, 5], { min: 2, max: 4 }),
        shuffle: () => faker.helpers.shuffle([1, 2, 3, 4, 5]),
        multiple: () =>
            faker.helpers.multiple(() => faker.person.firstName(), {
                count: 5,
            }),
    },

    // Цвета
    color: {
        human: () => faker.color.human(),
        rgb: () => faker.color.rgb(),
        space: () => faker.color.space(),
    },

    // Финансы
    finance: {
        amount: () => faker.finance.amount(),
        accountNumber: () => faker.finance.accountNumber(),
        currencyCode: () => faker.finance.currencyCode(),
    },
}

/**
 * Пример использования seed для воспроизводимости
 */
export function generateWithSeed<T>(seed: number, generator: () => T): T {
    faker.seed(seed)
    const result = generator()
    // Сбрасываем seed после генерации
    faker.seed()
    return result
}

/**
 * Генерация пагинированного ответа
 */
export function generatePaginatedResponse<T>(
    generator: () => T,
    page: number = 1,
    pageSize: number = 10,
    total: number = 100
) {
    const start = (page - 1) * pageSize
    const data = faker.helpers.multiple(generator, {
        count: Math.min(pageSize, total - start),
    })

    return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
    }
}
