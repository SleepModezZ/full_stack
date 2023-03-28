import { Patient, HealthCheckEntry } from '../types';
import { useState } from 'react';
import patientService from "../services/patients";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CSS from 'csstype';
import {AxiosError} from "axios";

// propsien tyypit:

interface ErrorMessageProps {
  message: string;
}

interface EntryFormProps {
  patientId: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  patients: Patient[];
}

// css-määritykset:

const warning: CSS.Properties = {
  backgroundColor: "mistyrose",
};

// Komponentit:

const ErrorMessage = (props: ErrorMessageProps) => {
  if (props.message.length === 0) {
    return (
      <div></div>
    )
  } else {
    return (
      <div style={warning} ><ErrorOutlineIcon color="warning" />&nbsp;&nbsp;&nbsp;<span style={{color:'red'}}>{props.message}</span><br/><br/></div>
    )
  }
}


// Koodit laitetaan taulukkoon, ei tarkistuksia:
const parseCodes = (codes: string): string[] | undefined => {
  const result = codes.split(/[ ,]+/);
  if (result[0].length === 0) {
    return undefined;
  }
  return result;
}

const EntryForm = (props: EntryFormProps) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [rating, setRating] = useState('');
  const [codes, setCodes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const resetForm = () => {
    setDescription('');
    setDate('');
    setSpecialist('');
    setRating('');
    setCodes('');
    setErrorMessage('');
  }

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
    const newEntry: HealthCheckEntry = {
      type: 'HealthCheck',
      description: description,
      date: date,
      specialist: specialist,
      healthCheckRating: parseInt(rating),
      diagnosisCodes: parseCodes(codes),
      id: '' // Backend luo oikean id:n. En halunnut tehdä omaa tyyppiä id:ttömiä Entry:jä varten...
    }
    
      await patientService.newEntry(props.patientId, newEntry).then(data => {
        props.setPatients(props.patients.map(p => (p.id === data.id) ? data : p));
        props.setPatient(data);
      })
      setDescription('');
      setDate('');
      setSpecialist('');
      setRating('');
      setCodes('');
      setErrorMessage('');

    } catch (error) {

      if (error instanceof Error) {
        // Mikäli kyse on Axiosin välittämästä backendin virheestä:
        if (error instanceof AxiosError && error.response) {
          setErrorMessage(error.response.data);

        } else {
          // mikäli kyse olisi itse heittämästäni poikkeuksesta (sellaisia ei pitäisi tällä hetkellä olla, mutta Entryn kentille
          // olisi mahdollista, ja toivottavaakin, lisätä tarkistuksia jo frontendiin):
        setErrorMessage(error.message);
        }
      } else {
        // Jos virhe ei ole tyyppiä Error (en tiedä, onko tämä mahdollista), tulostetaan se kuitenkin konsoliin:)
        console.error(error);
      }
    }
  }

  return (
    <div>
      <ErrorMessage message={errorMessage} />
      <Box  component="form" noValidate autoComplete="off" style={{ border: '2px dotted' }}
        sx={{ p: 2 }} onSubmit={addEntry}>
      <h4>New HealthCheck entry</h4>
        <TextField  variant="standard" label="Description" fullWidth type="description" value={description} onChange={(event) => setDescription(event.target.value)}/>
        <TextField  variant="standard" fullWidth type="date" value={date} onChange={(event) => setDate(event.target.value)}/>
        <TextField  variant="standard" label="Specialist" fullWidth type="specialist" value={specialist} onChange={(event) => setSpecialist(event.target.value)}/>
        <TextField  variant="standard" label="HealthCheck rating" fullWidth type="rating" value={rating} onChange={(event) => setRating(event.target.value)}/>
        <TextField  variant="standard" label="Diagnosis codes" fullWidth type="codes" value={codes} onChange={(event) => setCodes(event.target.value)}/>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}  >
          <Button variant="contained" color="error" onClick={() => {resetForm();}}>cancel</Button>
          <Button  variant="contained" type='submit'>add</Button>
        </Box>
        
      </Box>
    </div>
  )
}

export default EntryForm