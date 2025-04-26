import type { CheckedState } from '@radix-ui/react-checkbox'
import { useCallback } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { defaultValues, withForm } from '@/features/pinned-threads/hooks/use-form'
import { usePinnedThreads } from '@/features/pinned-threads/hooks/use-pinned-threads'
import { Portal } from '@/features/shared/components/portal'

const styles = {
  backgroundColor: '#272d30',
  color: '#79848b',
  padding: '6px 5px',
  width: '40px',
  display: 'table-cell',
  verticalAlign: 'middle'
}

export const TableHeaderCell = withForm({
  defaultValues,
  render: ({ form }) => {
    const { tableHeaderRow, tableRows, allChecked } = usePinnedThreads()

    const handleCheckedChange = useCallback((checked: CheckedState) => {
      form.setFieldValue('items', checked === true ? tableRows.map(({ id }) => id) : [])
      allChecked.setState(checked)
    }, [])

    return (
      <Portal
        root={tableHeaderRow}
        styles={styles}
      >
        <div className='flex items-center justify-center'>
          <Checkbox
            disabled={!tableRows.length}
            checked={allChecked.state}
            onCheckedChange={handleCheckedChange}
          />
        </div>
      </Portal>
    )
  }
})
