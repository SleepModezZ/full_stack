import { DiaryEntry} from '../types'

interface TotalProps {
  entry:DiaryEntry;
}

const ShowEntries = (props: TotalProps) => {
  const item = props.entry;
  return (
    <div>
      <p><b>{item.date}</b></p>
      <p>visibility: {item.visibility}<br/>
      weather: {item.weather}<br/>
      comment: {item.comment}</p>
    </div>
  )
}

export default ShowEntries