import { Checkbox } from '@/components/ui/checkbox'
import { useFavorites } from '@/features/favorites/hooks/use-favorites'
import { defaultValues, withForm } from '@/features/favorites/hooks/use-form'
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
    const { tableHeaderRow, tableRows, allChecked } = useFavorites()

    return (
      <Portal
        root={tableHeaderRow}
        styles={styles}
      >
        <div className='flex items-center justify-center'>
          <Checkbox
            disabled={!tableRows.length}
            checked={allChecked.state}
            onCheckedChange={checked => {
              form.setFieldValue('items', checked === true ? tableRows.map(({ id }) => id) : [])
              allChecked.setState(checked)
            }}
          />
        </div>
      </Portal>
    )
  }
})
