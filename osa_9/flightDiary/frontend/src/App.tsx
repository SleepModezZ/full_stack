import { useState, useEffect } from 'react';
import ShowEntries from './components/ShowEntries'
import EntryForm from './components/EntryForm'
import { DiaryEntry } from './types';
import { getAllEntries } from './services/diaryService';

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  // useEffect(() => {
  //   axios.get<DiaryEntry[]>('http://localhost:3001/api/diaries').then(response => {
  //     setEntries(response.data);
  //   })
  // }, [])

  useEffect(() => {
    getAllEntries().then(data => {
      setEntries(data)
    })
  }, [])

  return (
    <div>
      <EntryForm entries={entries} setEntries={setEntries} />
      <ShowEntries entries={entries}/>
    </div>
  );
};

export default App;

