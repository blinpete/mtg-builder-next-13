
export function GenericTable<Item extends { [key: string]: any}>(props: {
  columns: ({
    label: string
    cellFn: (item: Item) => JSX.Element | string | number | null | undefined
  })[]
  rows: Item[]
  getId: (item: Item) => string | number
}) {
  return (
    <table>
      <thead>
        {props.columns.map((col, i) => <th key={i}>{col.label}</th>)}
      </thead>
      <tbody>
        {props.rows.map(item => {
          const itemId = props.getId(item)

          return (
            <tr key={itemId}>
              {props.columns.map((col, i) => (
                <td key={`${itemId}_i`}>{col.cellFn(item)}</td>
              ))}
            </tr>
          )}
        )}
      </tbody>
    </table>
  )
}