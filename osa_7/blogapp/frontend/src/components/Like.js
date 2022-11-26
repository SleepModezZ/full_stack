import { addLike } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

const Like = (props) => {
  const blog = props.blog
  const add = async () => {
    try {
      await props.addLike(blog.id)
      const message = 'you liked ' + blog.title + ' by ' + blog.author
      props.setNotification({ confirmation: true, message: message })
    } catch (exception) {
      props.setNotification({ confirmation: false, message: exception.message })
    }
  }

  return (
    <div>
      {blog.likes} likes
      <Button variant="outline-success m-2" id="like" onClick={add}>
        like
      </Button>
    </div>
  )
}

const mapDispatchToProps = {
  addLike,
  setNotification,
}

export default connect(null, mapDispatchToProps)(Like)
