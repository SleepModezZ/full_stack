import patientData from '../../data/patients';
import { Patient, NonSensitivePatient} from '../types';


let patients: Patient[] = patientData;
const nonSensitivePatients: NonSensitivePatient[] = patientData as NonSensitivePatient[];

const getPatients = (): NonSensitivePatient[]  => {
  return nonSensitivePatients.map(({id, name, dateOfBirth, gender, occupation}) => ({id, name, dateOfBirth, gender, occupation}));
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (patientEntry: Patient): Patient => {
  patientData.push(patientEntry);
  return patientEntry;
};

const updatePatient = (id: string, patientEntry: Patient): Patient => {
  patients = patients.map(p => p.id === id ? patientEntry : p);
  return patientEntry;
};

export default {
  getPatients,
  getPatient,
  addPatient,
  updatePatient
};