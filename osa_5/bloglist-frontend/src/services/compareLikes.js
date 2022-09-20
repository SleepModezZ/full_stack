const compareLikes = (a, b) => {
  if (a.likes < b.likes) {
    return 1
  }
  if (a.likes > b.likes) {
    return -1
  }
  return 0
}

export default compareLikes
