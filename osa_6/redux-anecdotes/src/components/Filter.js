import { filterInput } from '../reducers/filterReducer'
import { connect } from 'react-redux'

const Filter = (props) => {

  const updateValue = (e) => {
    props.filterInput(e.target.value)
  }

  return (
    <div>
      filter<input onChange={updateValue} placeholder="" id="filter" name="filter"></input>
    </div>
  )
}

const mapDispatchToProps = {
  filterInput,
}

export default connect(null, mapDispatchToProps)(Filter)
