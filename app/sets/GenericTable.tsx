
export function GenericTable<Item extends { [key: string]: any}>(props: {
  columns: ({
    label: string
    cellFn: (item: Item) => JSX.Element | string | number | null | undefined
  })[]
  rows: Item[]
  getId: (item: Item) => string | number
  // classes?: Record<'th' | 'tr' | 'td', string>
}) {
  return (
    <table className="border-collapse border-2 px-20">
      <thead className="bg-slate-800">
        {props.columns.map((col, i) => <th className="py-2 px-2 text-left" key={i}>{col.label}</th>)}
      </thead>
      <tbody>
        {props.rows.map(item => {
          const itemId = props.getId(item)

          return (
            <tr key={itemId} className="hover:bg-slate-900 odd:border-b border-2">
              {props.columns.map((col, i) => (
                <td className="py-0.5 px-2" key={`${itemId}_i`}>{col.cellFn(item)}</td>
              ))}
            </tr>
          )}
        )}
      </tbody>
    </table>
  )
}