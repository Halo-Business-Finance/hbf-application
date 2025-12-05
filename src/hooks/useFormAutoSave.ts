import { useEffect, useCallback, useRef } from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { toast } from 'sonner';

interface UseFormAutoSaveOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  storageKey: string;
  debounceMs?: number;
  excludeFields?: Path<T>[];
  onRestore?: (data: Partial<T>) => void;
}

export function useFormAutoSave<T extends FieldValues>({
  form,
  storageKey,
  debounceMs = 1000,
  excludeFields = [],
  onRestore,
}: UseFormAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasRestoredRef = useRef(false);
  const lastSavedRef = useRef<string>('');

  // Restore saved data on mount
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        const savedDate = new Date(timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);

        // Only restore if saved within the last 24 hours
        if (hoursDiff < 24 && data) {
          // Filter out excluded fields
          const filteredData = { ...data };
          excludeFields.forEach((field) => {
            delete filteredData[field as string];
          });

          // Reset form with saved values
          Object.entries(filteredData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              form.setValue(key as Path<T>, value as any, { shouldValidate: false });
            }
          });

          onRestore?.(filteredData);
          
          toast.info('Draft restored', {
            description: `Your progress from ${savedDate.toLocaleString()} has been restored.`,
            action: {
              label: 'Clear',
              onClick: () => clearSavedData(),
            },
          });
        }
      }
    } catch (error) {
      console.error('Failed to restore form data:', error);
    }
  }, [storageKey]);

  // Save data with debounce
  const saveData = useCallback((data: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        // Filter out excluded fields and empty values
        const filteredData: Partial<T> = {};
        Object.entries(data).forEach(([key, value]) => {
          if (
            !excludeFields.includes(key as Path<T>) &&
            value !== undefined &&
            value !== null &&
            value !== ''
          ) {
            (filteredData as any)[key] = value;
          }
        });

        const savePayload = JSON.stringify({
          data: filteredData,
          timestamp: new Date().toISOString(),
        });

        // Only save if data has changed
        if (savePayload !== lastSavedRef.current) {
          localStorage.setItem(storageKey, savePayload);
          lastSavedRef.current = savePayload;
        }
      } catch (error) {
        console.error('Failed to auto-save form data:', error);
      }
    }, debounceMs);
  }, [storageKey, debounceMs, excludeFields]);

  // Watch form changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      saveData(data as T);
    });

    return () => subscription.unsubscribe();
  }, [form, saveData]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      lastSavedRef.current = '';
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  }, [storageKey]);

  // Clear on successful submission
  const clearOnSubmit = useCallback(() => {
    clearSavedData();
    toast.success('Application submitted', {
      description: 'Your draft has been cleared.',
    });
  }, [clearSavedData]);

  // Get last saved timestamp
  const getLastSavedTime = useCallback((): Date | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { timestamp } = JSON.parse(saved);
        return new Date(timestamp);
      }
    } catch (error) {
      console.error('Failed to get last saved time:', error);
    }
    return null;
  }, [storageKey]);

  return {
    clearSavedData,
    clearOnSubmit,
    getLastSavedTime,
  };
}
