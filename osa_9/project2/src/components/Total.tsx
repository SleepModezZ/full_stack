interface TotalProps {
  parts: { name: string, exerciseCount: number }[];
}


const Total = (props: TotalProps) => {
  const count = props.parts.reduce((carry, part) => carry + part.exerciseCount, 0)
  return (
    <div>
      <p>Number of exercises{" "}{count}</p>
    </div>
  )
}

export default Total