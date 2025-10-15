/**
 * Пример использования типизированного API с React Query
 *
 * Этот файл демонстрирует паттерны использования API клиента
 * вместе с TanStack Query для кэширования и управления состоянием.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
	getUserProfile,
	updateUserProfile,
	loginUser,
	registerUser,
	getUsersList,
	type UpdateProfileRequest,
	type LoginRequest,
	type RegisterRequest,
} from "@/shared/api"

/**
 * Хук для получения профиля текущего пользователя
 *
 * @example
 * function ProfileComponent() {
 *   const { data: user, isLoading, error } = useUserProfile()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!user) return null
 *
 *   return <div>Hello, {user.username}</div>
 * }
 */
export function useUserProfile() {
	return useQuery({
		queryKey: ["user", "profile"],
		queryFn: async () => {
			const { data, error } = await getUserProfile()
			if (error) throw new Error(error.error || "Failed to fetch profile")
			return data
		},
	})
}

/**
 * Хук для получения списка пользователей
 *
 * @example
 * function UsersListComponent() {
 *   const { data: users, isLoading } = useUsersList({ limit: 10, offset: 0 })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <ul>
 *       {users?.map(user => (
 *         <li key={user.id}>{user.username}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 */
export function useUsersList(params?: { limit?: number; offset?: number }) {
	return useQuery({
		queryKey: ["users", "list", params],
		queryFn: async () => {
			const { data, error } = await getUsersList(params)
			if (error) throw new Error(error.error || "Failed to fetch users")
			return data
		},
	})
}

/**
 * Хук для обновления профиля пользователя
 *
 * @example
 * function UpdateProfileForm() {
 *   const { mutate: updateProfile, isPending } = useUpdateProfile()
 *
 *   const handleSubmit = (formData: UpdateProfileRequest) => {
 *     updateProfile(formData, {
 *       onSuccess: (user) => {
 *         console.log("Profile updated:", user)
 *       },
 *       onError: (error) => {
 *         console.error("Update failed:", error)
 *       }
 *     })
 *   }
 *
 *   return <form onSubmit={...}>...</form>
 * }
 */
export function useUpdateProfile() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: UpdateProfileRequest) => {
			const { data: user, error } = await updateUserProfile(data)
			if (error)
				throw new Error(error.error || "Failed to update profile")
			return user
		},
		onSuccess: (user) => {
			// Обновляем кэш профиля
			queryClient.setQueryData(["user", "profile"], user)
			// Инвалидируем список пользователей
			queryClient.invalidateQueries({ queryKey: ["users", "list"] })
		},
	})
}

/**
 * Хук для входа в систему
 *
 * @example
 * function LoginForm() {
 *   const { mutate: login, isPending, error } = useLogin()
 *
 *   const handleSubmit = (credentials: LoginRequest) => {
 *     login(credentials, {
 *       onSuccess: (authResponse) => {
 *         console.log("Logged in:", authResponse.user)
 *         // Редирект на главную страницу
 *       }
 *     })
 *   }
 *
 *   return <form onSubmit={...}>...</form>
 * }
 */
export function useLogin() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (credentials: LoginRequest) => {
			const { data, error } = await loginUser(credentials)
			if (error) {
				throw new Error(error.error || "Login failed")
			}
			return data
		},
		onSuccess: (authResponse) => {
			// Сохраняем данные пользователя в кэш
			if (authResponse?.user) {
				queryClient.setQueryData(["user", "profile"], authResponse.user)
			}
		},
	})
}

/**
 * Хук для регистрации нового пользователя
 *
 * @example
 * function RegisterForm() {
 *   const { mutate: register, isPending } = useRegister()
 *
 *   const handleSubmit = (formData: RegisterRequest) => {
 *     register(formData, {
 *       onSuccess: (authResponse) => {
 *         console.log("Registered:", authResponse.user)
 *         // Редирект на главную страницу
 *       },
 *       onError: (error) => {
 *         console.error("Registration failed:", error)
 *       }
 *     })
 *   }
 *
 *   return <form onSubmit={...}>...</form>
 * }
 */
export function useRegister() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: RegisterRequest) => {
			const { data: authResponse, error } = await registerUser(data)
			if (error) {
				throw new Error(error.error || "Registration failed")
			}
			return authResponse
		},
		onSuccess: (authResponse) => {
			// Сохраняем данные пользователя в кэш
			if (authResponse?.user) {
				queryClient.setQueryData(["user", "profile"], authResponse.user)
			}
		},
	})
}

/**
 * Query ключи для удобного управления кэшем
 */
export const queryKeys = {
	user: {
		all: ["user"] as const,
		profile: () => [...queryKeys.user.all, "profile"] as const,
	},
	users: {
		all: ["users"] as const,
		list: (params?: { limit?: number; offset?: number }) =>
			[...queryKeys.users.all, "list", params] as const,
	},
} as const
