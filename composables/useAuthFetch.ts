let refreshPromise: Promise<boolean> | null = null

export function useAuthFetch() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  async function authFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}) {
    const makeReq = () =>
      $fetch<T>(`${config.public.apiBase}${url}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          ...((options.headers as Record<string, string>) ?? {}),
        },
      })

    try {
      return await makeReq()
    } catch (err: any) {
      const status = err?.response?.status ?? err?.statusCode
      if (status !== 401) throw err

      if (!refreshPromise) {
        refreshPromise = authStore.refresh().finally(() => {
          refreshPromise = null
        })
      }
      const ok = await refreshPromise
      if (!ok) throw err
      return makeReq()
    }
  }

  return { authFetch }
}
