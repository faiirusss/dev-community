import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "~/lib/trpc";
import type { SaveDraftSchema } from "~/schemas/posts";

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

interface AutosaveOptions {
  interval?: number;
  enabled?: boolean;
  draftId?: string;
}

interface AutosaveResult {
  isSaving: boolean;
  lastSavedAt: Date | null;
  error: Error | null;
  saveNow: () => void;
}

export function useAutosave(
  data: SaveDraftSchema,
  options?: AutosaveOptions
): AutosaveResult {
  const {
    interval = 30000,
    enabled = true,
    draftId,
  } = options ?? {};

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const lastSavedDataRef = useRef<string>("");
  const debouncedData = useDebounce(data, interval);
  const saveMutation = trpc.drafts.save.useMutation();
  
  const hasContent = useCallback((d: SaveDraftSchema): boolean => {
    return !!(
      d.title ||
      d.content ||
      d.coverImage ||
      d.description ||
      (d.tags && d.tags.length > 0)
    );
  }, []);
  
  const hasDataChanged = useCallback((d: SaveDraftSchema): boolean => {
    const currentData = JSON.stringify(d);
    return currentData !== lastSavedDataRef.current;
  }, []);
  
  const save = useCallback(async (dataToSave: SaveDraftSchema) => {
    if (!hasContent(dataToSave) || !hasDataChanged(dataToSave)) {
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await saveMutation.mutateAsync({
        ...dataToSave,
        id: draftId,
      });
      
      setLastSavedAt(new Date());
      lastSavedDataRef.current = JSON.stringify(dataToSave);
      
      return result;
    } catch (err) {
      const saveError = err instanceof Error 
        ? err 
        : new Error("Failed to save draft");
      setError(saveError);
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, [draftId, hasContent, hasDataChanged, saveMutation]);
  
  useEffect(() => {
    if (!enabled || !hasContent(debouncedData)) {
      return;
    }
    
    save(debouncedData);
  }, [debouncedData, enabled, hasContent, save]);
  
  const saveNow = useCallback(() => {
    if (!hasContent(data)) {
      return;
    }
    
    save(data);
  }, [data, hasContent, save]);
  
  useEffect(() => {
    setError(null);
  }, [data]);
  
  return {
    isSaving,
    lastSavedAt,
    error,
    saveNow,
  };
}