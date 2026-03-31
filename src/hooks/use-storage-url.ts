import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"

const isServer = typeof window === "undefined"

/**
 * Resolves a Convex storage ID to a public URL.
 * If the input is already a full URL (e.g. OAuth avatar), returns it directly.
 * SSR-safe: skips the Convex query on the server to prevent hydration crashes.
 * Returns `{ url, isLoading }` so consumers can show a skeleton while resolving.
 */
export function useStorageUrl(storageId: string | null | undefined) {
  const isFullUrl = storageId?.startsWith("http")
  const shouldQuery = !isServer && !!storageId && !isFullUrl

  const resolved = useQuery(
    api.storage.getUrl,
    shouldQuery
      ? { storageId: storageId as Id<"_storage"> }
      : "skip"
  )

  // Already a full URL — no loading needed
  if (isFullUrl) return { url: storageId!, isLoading: false }

  // No image at all
  if (!storageId) return { url: null, isLoading: false }

  // SSR or Convex query still resolving
  if (isServer || resolved === undefined) return { url: null, isLoading: true }

  return { url: resolved ?? null, isLoading: false }
}