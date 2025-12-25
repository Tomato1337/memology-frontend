// Задача для самостоятельного решения
// Дана матрица размером M x N, содержащая большие латинские буквы и строка word, также состоящая из больших латинских букв.

// Слово может быть составлено из последовательности смежных ячеек с соответствующими буквами, где смежные ячейки являются соседними по горизонтали или вертикали. Одна и та же ячейка с буквой не может быть использована более одного раза.

// Например:
// matrix = [
//     ['A', 'F', 'R', 'D', 'H'],
//     ['O', 'L', 'M', 'O', 'E'],
//     ['L', 'M', 'Q', 'L', 'L']
// ]
// word = 'HELLO'
// Задача: Вернуть true, если слово word существует в матрице.
// Для примера выше вывод будет true , т.к. слово HELLO есть в матрице.

// Писать код, читающий поток ввода/вывода не надо. Представьте, что у вас есть функция: isWordPresentInMatrix(matrix, word)

const isWordPresentInMatrix = (matrix, word) => {
	const copyMatrix = matrix.map((row) => [...row])

	const dfs = (i, j, index) => {
		if (index === word.length) return true

		if (
			i < 0 ||
			j < 0 ||
			i >= copyMatrix.length ||
			j >= copyMatrix[i].length ||
			copyMatrix[i][j] !== word[index]
		) {
			return false
		}

		const temp = copyMatrix[i][j]
		copyMatrix[i][j] = null

		const found =
			dfs(i + 1, j, index + 1) ||
			dfs(i - 1, j, index + 1) ||
			dfs(i, j + 1, index + 1) ||
			dfs(i, j - 1, index + 1)
		copyMatrix[i][j] = temp
		return found
	}

	for (let i = 0; i < copyMatrix.length; i++) {
		for (let j = 0; j < copyMatrix[i]?.length; j++) {
			if (dfs(i, j, 0)) {
				return true
			}
		}
	}

	return false
}

const matrix = [
	["A", "F", "R", "D", "H"],
	["O", "L", "A", "O", "E"],
	["L", "M", "Q", "L", "A"],
]
const word = "AAA"

console.log(isWordPresentInMatrix(matrix, word))
