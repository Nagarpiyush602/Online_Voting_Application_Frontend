import { useCallback, useEffect, useState } from "react";

/**
 * useApi — Custom hook for API calls with loading, data, and error states.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(fetchFunction);
 *
 * - Automatically calls the API on mount
 * - Provides a `refetch` function for manual refresh
 * - Keeps code DRY across pages
 */
const useApi = (apiFn, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [execute, autoFetch]);

  return { data, loading, error, refetch: execute };
};

export default useApi;
