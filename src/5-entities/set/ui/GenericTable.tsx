// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GenericTable<Item extends { [key: string]: any }>(props: {
  columns: {
    label: string
    cellFn: (item: Item) => JSX.Element | string | number | null | undefined
  }[]
  rows: Item[]
  getId: (item: Item) => string | number
  // classes?: Record<'th' | 'tr' | 'td', string>
}) {
  console.log(
    "🚀 | rows:",
    props.rows.map(r => r.id)
  )

  return (
    <table className="border-collapse px-20 my-3">
      <thead className="text-slate-800 font-bold border-b border-zinc-400/30">
        <tr>
          {props.columns.map((col, i) => (
            <th className="py-2 px-2 text-left" key={"table_" + i}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="mt-4">
        {props.rows.map(item => {
          const itemId = props.getId(item)

          return (
            <tr key={itemId} className="hover:bg-zinc-400/30">
              {props.columns.map((col, i) => (
                <td className="py-0.5 px-2" key={`${itemId}_${i}`}>
                  {col.cellFn(item)}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
