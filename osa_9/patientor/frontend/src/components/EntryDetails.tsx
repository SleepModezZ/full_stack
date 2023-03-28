import { Entry, OccupationalHealthcareEntry, HospitalEntry, HealthCheckEntry } from '../types';
import CSS from 'csstype';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

// type declarations:

type  ShowCodeProps = {
  code: string;
  diagnoses: Map<string, string>;
}

type DiagnosesProps = {
  codes: string[] | undefined;
  diagnoses: Map<string, string>;
}

type EntryProps = {
  entry: Entry;
  diagnoses: Map<string, string>;
}

type OccProps = {
  entry: OccupationalHealthcareEntry;
  diagnoses: Map<string, string>;
}

type HospitalProps = {
  entry: HospitalEntry;
  diagnoses: Map<string, string>;
}

type HealthCheckProps = {
  entry: HealthCheckEntry;
  diagnoses: Map<string, string>;
}


// css-style declarations:

const rightAlign: CSS.Properties = {
  float: "right",
};


// helper-function::

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

// Components:

const ShowCode = ({code, diagnoses}: ShowCodeProps) => {
  let diagnosis = diagnoses.get(code);
  if (diagnosis === undefined) {
    diagnosis = '';
  }
  return (
    <div >
      {code + " " + diagnosis}
    </div>
  )
}

const Diagnoses = ({codes, diagnoses}: DiagnosesProps) => {
  if (codes && codes.length > 0) {
    return (
      <div>
        <b>Diagnoses:</b>
        <ul>
          {codes.map(c => <li  key={c} >{}<ShowCode  code={c} diagnoses={diagnoses}/></li>)}
        </ul>
      </div>
    )
  }
  return (<></>)
}

const Hospital = ({ entry, diagnoses }: HospitalProps) => {
  return (
    <div>
      <LocalHospitalIcon /> &nbsp;&nbsp;&nbsp; <b>Hospital Visit</b><span style={rightAlign}>{entry.date}</span><br/><br/>
      <i>{entry.description}</i><br /><br/>
      <Diagnoses codes={entry.diagnosisCodes} diagnoses={diagnoses}/>
      Doctor: {entry.specialist}
    </div>
  )
}

const OccupationalHealthcare = ({ entry, diagnoses }: OccProps) => {
  return (
    <div>
      <HealingIcon /> &nbsp;&nbsp;&nbsp; <b>Occupational Healthcare</b> <span style={rightAlign}>{entry.date}</span><br />
      <br/>Employer: <b>{entry.employerName}</b><br/><br/>
      <i>{entry.description}</i><br/><br/>
      <Diagnoses codes={entry.diagnosisCodes} diagnoses={diagnoses}/>
      Doctor: {entry.specialist}
    </div>
  )
}

const HealthCheck = ({ entry, diagnoses }: HealthCheckProps) => {
  let rating = <AssignmentTurnedInIcon />;


  switch (entry.healthCheckRating) {
    case 0: rating = <AssignmentTurnedInIcon color="success"/>;
    break;
    case 1: rating = <AssignmentTurnedInIcon color="primary" />;
    break;
    case 2: rating = <AssignmentTurnedInIcon color="warning" />
    break;
    case 3: rating = <AssignmentTurnedInIcon color="error" />
  }
  
  return (
    <div>
      {rating} &nbsp;&nbsp;&nbsp; <b>Healthcheck</b> <span style={rightAlign}>{entry.date}</span><br/><br/>
      <i>{entry.description}</i><br/><br/>
      <Diagnoses codes={entry.diagnosisCodes} diagnoses={diagnoses}/>
      Doctor: {entry.specialist}
    </div>
  )
}

const EntryDetails = ({entry, diagnoses}: EntryProps) => {
  switch (entry.type) {
    case "Hospital":
      return <Hospital entry={entry} diagnoses={diagnoses}/>;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare  entry={entry} diagnoses={diagnoses}/>;
    case "HealthCheck":
      return <HealthCheck  entry={entry} diagnoses={diagnoses}/>;
    default:
      return assertNever(entry);
  }
}


export default EntryDetails;