import { DiaryEntry, Weather, Visibility } from '../types';
import { useState } from 'react';
import { createEntry } from '../services/diaryService';
import axios from 'axios';

interface EntryFormProps {
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  entries: DiaryEntry[];
}

interface ErrorMessageProps {
  message: string;
}

// Komponentti virheviestin näyttämiseksi:
const ErrorMessage = (props: ErrorMessageProps) => {
  if (props.message.length === 0) {
    return (
      <div></div>
    )
  } else {
    return (
      <div><span style={{color:'red'}}>{props.message}</span><br/><br/></div>
    )
  }
}

const EntryForm = (props: EntryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry = {
      date: date,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment: comment
    }

    try {
      await createEntry(newEntry).then(data => {
        props.setEntries(props.entries.concat(data))
      })
    setErrorMessage('');
    setDate('')
    setVisibility('')
    setWeather('')
    setComment('')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data);
      } else {
        console.error(error);
      }
    }
  }

  // Luon automaattisesti radio-painikkeet enumien perusteella.
  // Ratkaisussa on lainattu ratkaisusta sivulta https://stackoverflow.com/questions/41308123/map-typescript-enum

  return (
    <div>
      <h2>Add new entry</h2>
      <ErrorMessage message={errorMessage} />
      <form onSubmit={addEntry}>
        <div>date: <input type="date" value={date} onChange={(event) => setDate(event.target.value)}/></div>
        <div>visibility:&nbsp;
          {(Object.values(Visibility) as Array<string>).map((choice) => 
            <label key={choice}>{choice}<input type="radio" name="visibility" value={choice} checked={choice === visibility} onChange={(event) => setVisibility(event.target.value)}/></label>)}
        </div>
        <div>weather:&nbsp;
          {(Object.values(Weather) as Array<string>).map((choice) => 
            <label key={choice}>{choice}<input type="radio" name="weather" value={choice} checked={choice === weather} onChange={(event) => setWeather(event.target.value)}/></label>)}
        </div>
        <div>comment: <input value={comment} onChange={(event) => setComment(event.target.value)}/></div>
        <button type='submit'>add</button>
      </form>
    </div>
  )
}

export default EntryForm