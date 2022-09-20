const Notification = ({ errorMessage, confirmationMessage }) => {
  if (errorMessage) {
    return (
      <div className="error">
        {errorMessage}
      </div>
    )
  }

  if (confirmationMessage) {
    return (
      <div className="confirmation">
        {confirmationMessage}
      </div>
    )
  }

  return null
}

export default Notification
