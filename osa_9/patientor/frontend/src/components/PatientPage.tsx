import { Patient } from '../types';
import { useParams } from 'react-router-dom'
import patientService from "../services/patients";
import { useState, useEffect } from "react";
import EntryDetails from './EntryDetails';
import EntryForm from './EntryForm';
import Card from '@mui/material/Card';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';


type PatientPageProps = {
  diagnoses: Map<string,string>;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}


type GenderProps = {
  gender: string;
}


const Gender = (props: GenderProps) => {
  if (props.gender === 'male') {
    return (<><MaleIcon /></>)
  }

  if (props.gender === 'female') {
    return (<><FemaleIcon /></>)
  }
  return(<></>)
}


const PatientPage = (props: PatientPageProps) => {
  const maybeId = useParams().id;
  const id = maybeId ? maybeId : '';
  const [patient, setPatient] = useState<Patient | undefined >(undefined);


  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.get(id);
      setPatient(patient);
    };
    void fetchPatient();
  }, [id]);
  

  if (patient) {
    return (
      <div><h2>{patient.name}<Gender gender={patient.gender}/></h2>
        ssn: {patient.ssn}<br />
        occupation: {patient.occupation}
        <br /><br />
        <EntryForm patientId={patient.id} setPatient={setPatient} patients={props.patients} setPatients={props.setPatients}/>
        <h3>entries</h3>
        {patient.entries.map(e => <Card style={{ border: '2px solid' }} sx={{ p: 2 }} key={e.id} ><EntryDetails entry={e} diagnoses={props.diagnoses} /></Card>)}
      </div>
    )
  }

  // Jos potilasta ei löydy, palautetaan vain tyhjä sivu:
  return (
    <div></div>
  )
}


export default PatientPage;