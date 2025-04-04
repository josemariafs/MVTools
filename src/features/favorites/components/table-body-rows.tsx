import { Checkbox } from '@/components/ui/checkbox'
import { useFavorites } from '@/features/favorites/hooks/use-favorites'
import { defaultValues, withForm } from '@/features/favorites/hooks/use-form'
import { Portal } from '@/features/shared/components/portal'

const styles = {
  backgroundColor: '#39464c',
  borderTop: '1px solid #262b31',
  padding: '14px 5px',
  display: 'table-cell',
  verticalAlign: 'middle'
}

export const TableBodyRows = withForm({
  defaultValues,
  render: ({ form }) => {
    const { allChecked, tableRows } = useFavorites()

    return (
      <form.Field
        name='items'
        listeners={{
          onChange: ({ value }) => {
            if (value.length === 0) {
              allChecked.setState(false)
              return
            }
            if (value.length === tableRows.length) {
              allChecked.setState(true)
              return
            }
            allChecked.setState('indeterminate')
          }
        }}
        children={field =>
          tableRows.map(({ id, row }) => (
            <Portal
              key={id}
              root={row}
              styles={styles}
            >
              <div className='flex items-center justify-center'>
                <Checkbox
                  checked={field.state.value.includes(id)}
                  onCheckedChange={checked => {
                    if (checked === true) {
                      field.setValue([...field.state.value, id])
                    } else {
                      field.setValue(field.state.value.filter(item => item !== id))
                    }
                  }}
                />
              </div>
            </Portal>
          ))
        }
      />
    )
  }
})
