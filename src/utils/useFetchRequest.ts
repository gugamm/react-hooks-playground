import { useState, useEffect } from 'react'

export interface RequestState<T> {
  loading: boolean,
  error: null | any,
  data: T | null
}

export const INITIAL_REQUEST_STATE = {
  loading: false,
  data: null,
  error: null
}

export function useFetchRequest<T>(fetcher: () => Promise<T>): RequestState<T> {
  const [requestState, setRequestState] = useState<RequestState<T>>(INITIAL_REQUEST_STATE)

  useEffect(() => {
    let componentIsMounted = true

    const fetchData = async () => {
      setRequestState({
        loading: true,
        data: null,
        error: null
      })

      const result = await fetcher()

      if (componentIsMounted) {
        setRequestState({
          loading: false,
          data: result,
          error: null
        })
      }
    }

    fetchData()

    return () => {
      componentIsMounted = false
    }
  }, [fetcher])

  return requestState
}
