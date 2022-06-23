import { useState } from 'react'

const StatisticLine = ({value, text, ep=''}) => {
  return (
    <tr><td>{text}</td><td>{value} {ep}</td></tr>
  )
}
const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Statistics = ({stats}) => {
  let sum = 0;
  for (let n of stats) {
    sum += n;
  }
  if (sum === 0) {
    return (
    <div>
      No feedback given
    </div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine value={stats[0]} text={'good'} />
        <StatisticLine value={stats[1]} text={'neutral'} />
        <StatisticLine value={stats[2]} text={'bad'} />
        <StatisticLine value={(stats[0]-stats[2])/sum} text={'average'} />
        <StatisticLine value={stats[0]/sum*100} text={'positive'} ep={'%'} />
        </tbody>
    </table>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const inc = (sel) => {
    switch (sel) {
      case 'good':
        return () => setGood(good + 1)
      case 'neutral':
        return () => setNeutral(neutral + 1)
      case 'bad':
        return () => setBad(bad + 1)
      default:
        return () => console.log('this is an error')
    }
  }
  
  return (
    <div>
        <h1>give feedback</h1>
        <Button handleClick={inc('good')} text='good' />
        <Button handleClick={inc('neutral')} text='neutral' />
        <Button handleClick={inc('bad')} text='bad' />
        <h1>statistics</h1>
        <Statistics stats={[good,neutral,bad]} />
    </div>
  )
}

export default App
