import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { setupStorageListener, type StorageSetupParams } from '@/utils/storage'

interface Props<T> extends Omit<StorageSetupParams<T>, 'onChangeCb'> {
  onChangeCb: (queryClient: QueryClient, newData?: T, oldData?: T) => void
}

export const useStorageListener = <T>({ storageKey, schema, logPrefix, onChangeCb }: Props<T>) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = setupStorageListener<T>({
      storageKey,
      schema,
      logPrefix,
      onChangeCb: (newData, oldData) => {
        onChangeCb(queryClient, newData, oldData)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [queryClient])
}
