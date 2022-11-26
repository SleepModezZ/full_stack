import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = (props) => {
  if (props.notification) {
    if (props.notification.confirmation) {
      return (
        <div className="container">
          <Alert variant="success">{props.notification.message}</Alert>
        </div>
      )
    } else {
      return (
        <div className="container">
          <Alert variant="danger">{props.notification.message}</Alert>
        </div>
      )
    }
  }
  return null
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  }
}

export default connect(mapStateToProps)(Notification)
