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

export function useFetchRequest<T>(fetcher: (params?: any) => Promise<T>, params?: any): RequestState<T> {
  const [requestState, setRequestState] = useState<RequestState<T>>(INITIAL_REQUEST_STATE)

  useEffect(() => {
    let componentIsMounted = true

    const fetchData = async () => {
      setRequestState({
        loading: true,
        data: null,
        error: null
      })

      const result = await fetcher(params)

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
  }, [fetcher, params])

  return requestState
}
