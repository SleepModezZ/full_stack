const Header = ({ course }) => {
  return (
    <div>
      <h1>{course.name}</h1>
    </div>
  )
}

const Part = ({ part }) => {
  return (
  <div>
    <p>
      {part.name} {part.exercises}
    </p>
  </div>
  )
}

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(part => 
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Total = ({ course }) => {
  const init = 0
  const total =  course.parts.reduce( (s, p) => s + p.exercises, init )
  return (
    <div>
      <p><b>Total of {total} exercises </b></p>
    </div>
  )
}    

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course}/>
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course 
