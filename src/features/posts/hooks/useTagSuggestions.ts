import { useState, useEffect } from "react";
import { trpc } from "~/lib/trpc";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface TagSuggestion {
  id: string;
  name: string;
  color: string;
}

interface UseTagSuggestionsResult {
  suggestions: TagSuggestion[];
  isLoading: boolean;
  error: Error | null;
}

export function useTagSuggestions(query: string): UseTagSuggestionsResult {
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = trpc.tags.search.useQuery(
    { query: debouncedQuery },
    {
      enabled: debouncedQuery.length >= 1,
    }
  );

  const normalizedError = error
    ? new Error(error.message)
    : null;

  return {
    suggestions: data || [],
    isLoading,
    error: normalizedError,
  };
}