import { CoursePart} from '../types'
import Part from './Part'

interface TotalProps {
  parts:CoursePart[];
}

const Content = (props: TotalProps) => {
  const items = props.parts.map(pa => <div key={pa.name}><Part part={pa} /></div>)
  return (
    <div>
      {items}
    </div>
  )
}

export default Content