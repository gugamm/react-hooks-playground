import { useState, useEffect, useRef } from 'react'

export interface RequestState<TData, TParams> {
  loading: boolean,
  error: null | any,
  data: TData | null,
  called: boolean,
  params: TParams
}

export interface UseFetchRequestResult<TData, TParams> extends RequestState<TData, TParams> {
  refetch: (params?: TParams) => Promise<void>,
  startPolling: (interval: number) => void,
  stopPolling: () => void
}

export interface UseFetchRequestOptions<TData, TFetchParams> {
  params: TFetchParams,
  pollInterval?: number,
  skip?: boolean,
  onCompleted?: (data: TData) => Promise<void>,
  onError?: (err: any) => Promise<void>
}

export const INITIAL_REQUEST_STATE: RequestState<any, any> = {
  loading: false,
  data: null,
  error: null,
  called: false,
  params: {}
}

const mergeRequestState = <TData, TParams>(nextRequestState?: Partial<RequestState<TData, TParams>>) => (prevRequestState: RequestState<TData, TParams>): RequestState<TData, TParams> => {
  return {
    ...prevRequestState,
    ...nextRequestState,
  }
}


type SetStateMethod = React.Dispatch<React.SetStateAction<any>>
export interface FetchDataParams {
  params: any,
  setRequestState: SetStateMethod,
  fetcher: (params: any) => Promise<any>,
  isComponentMounted: boolean,
  onCompleted?: (data: any) => Promise<void>,
  onError?: (err: any) => Promise<void>
}

export function useFetchRequest<TData, TFetchParams>(fetcher: (params: TFetchParams) => Promise<TData>, options: UseFetchRequestOptions<TData, TFetchParams> = { params: undefined as any }): UseFetchRequestResult<TData, TFetchParams> {
  const defaultFetchParams = options.params
  const isComponentMountedRef = useRef(false)
  const pollingRef = useRef<null | NodeJS.Timeout>(null)
  const isLoadingRef = useRef(false)
  const initialRequestState = mergeRequestState<TData, TFetchParams>({ params: defaultFetchParams })(INITIAL_REQUEST_STATE)
  const [requestState, setRequestState] = useState<RequestState<TData, TFetchParams>>(initialRequestState)

  const isRequestLoading = () => {
    return isLoadingRef.current
  }

  const fetchData = async (params: TFetchParams, isPoll: boolean = false) => {
    const nextParams = { ...defaultFetchParams, ...params }
    
    if (!isPoll) {
      setRequestState(mergeRequestState({
        loading: true,
        called: true,
        error: null,
        data: null,
        params: nextParams
      }))  
    } else {
      setRequestState(mergeRequestState({
        called: true,
        params: nextParams
      }))  
    }

    isLoadingRef.current = true
  
    try {
      const result = await fetcher(nextParams)
  
      if (isComponentMountedRef.current) {
        setRequestState(mergeRequestState({
          data: result,
          loading: false
        }))
  
        if (options.onCompleted) {
          await options.onCompleted(result)
        }
      }
    } catch (err) {
      if (isComponentMountedRef.current) {
        setRequestState(mergeRequestState({
          error: err,
          loading: false
        }))
  
        if (options.onError) {
          await options.onError(err)
        }
      }
    } finally {
      isLoadingRef.current = false
    }
  }

  const refetch = async (params?: TFetchParams): Promise<void> => {
    if (isRequestLoading()) {
      return
    }

    const nextParams: TFetchParams = (!!defaultFetchParams || !!params) ? { ...defaultFetchParams, ...params } : undefined as any
    await fetchData(nextParams)
  }

  const stopPolling = (): void => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }

  const startPolling = (interval: number): void => {
    stopPolling()
    pollingRef.current = setInterval(() => {
      if (!isRequestLoading()) {
        fetchData(requestState.params, true)
      }
    }, interval)
  }

  useEffect(() => {
    isComponentMountedRef.current = true
    return () => {
      isComponentMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const skip = !!options.skip
    
    if (!skip && !requestState.called) {
      fetchData(requestState.params)
    }

  // eslint-disable-next-line
  }, [options.skip])

  useEffect(() => {
    if (options.pollInterval !== undefined) {
      startPolling(options.pollInterval)
    }

    return () => {
      stopPolling()
    }
  
  // eslint-disable-next-line
  }, [options.pollInterval])

  return {
    called: requestState.called,
    data: requestState.data,
    error: requestState.error,
    loading: requestState.loading,
    params: requestState.params,
    refetch,
    startPolling,
    stopPolling
  }
}
