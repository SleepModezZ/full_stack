const Notification = ({ notification }) => {
  if (notification) {
    return (<div>{notification}</div>)
  }
  return (<div></div>)
}

export default Notification
