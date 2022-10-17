import { filterInput } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const Filter = () => {
  const dispatch = useDispatch()

  const updateValue = (e) => {
    dispatch(filterInput(e.target.value))
  }

  return (
    <div>
      filter<input onChange={updateValue} placeholder="" id="filter" name="filter"></input>
    </div>
  )
}

export default Filter
