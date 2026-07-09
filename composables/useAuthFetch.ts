export function useAuthFetch() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  function authFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}) {
    return $fetch<T>(`${config.public.apiBase}${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        ...((options.headers as Record<string, string>) ?? {}),
      },
    })
  }

  return { authFetch }
}
