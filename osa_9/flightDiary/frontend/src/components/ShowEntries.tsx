import { DiaryEntry} from '../types'
import ShowEntry from './ShowEntry'

interface TotalProps {
  entries:DiaryEntry[];
}

const ShowEntries = (props: TotalProps) => {
  const items = props.entries.map(e => <div key={e.id}><ShowEntry entry={e} /></div>)
  return (
    <div>
      <h2>Diary entries</h2>
      {items}
    </div>
  )
}

export default ShowEntries