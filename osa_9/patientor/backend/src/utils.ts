import { Gender, Patient, Entry, Discharge, SickLeave, HealthCheckRating, Diagnosis } from './types';
import { v1 as uuid } from 'uuid';


const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (num: unknown): num is number => {
  return typeof num === 'number' || num instanceof Number;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseName = (name: unknown): string => {
    if (!name || !isString(name)) {
      throw new Error('Incorrect or missing name');
    }
    return name;
};
  
const parseDateOdBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth)) {
    throw new Error('Incorrect or missing date of birth');
  }
  return dateOfBirth;
}; 

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing social security number');
  }
  return ssn;
};

const parseDescription = (description: unknown): string => {
  if (isString(description) && description.length > 2) {
    return description;
  }
  console.log("Täällä ollaan!");
  throw new Error('Incorrect or missing description');
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseDischarge = (object: unknown): Discharge => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data in discharge');
  }

  if ('criteria' in object && 'date' in object) {
    if ((!object.date || !isString(object.date)) || (!object.criteria || !isString(object.criteria))) {
      throw new Error('Incorrect or missing discharge');
    }
    return {date: object.date, criteria: object.criteria};
  }

    throw new Error('Incorrect or missing discharge');
};
  

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employerName');
  }
  return employerName;
};

const parseSickLeave = (object: unknown): SickLeave => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data in sickleave');
  }

  if ('startDate' in object && 'endDate' in object) {
    if ((!object.startDate || !isString(object.startDate)) || (!object.endDate || !isString(object.endDate))) {
      throw new Error('Incorrect or missing discharge');
    }
    return {startDate: object.startDate, endDate: object.endDate};
  }

    throw new Error('Incorrect or missing sickleave');
};


const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if (isNumber(healthCheckRating) && healthCheckRating in HealthCheckRating) {
    return healthCheckRating;
  }
  throw new Error('Incorrect or missing healthCheckRating');
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};


export const toNewPatientEntry = (object: unknown): Patient => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'occupation' in object && 'ssn' in object)  {
    const newPatientEntry: Patient = {
      id: uuid(),
      name: parseName(object.name),
      dateOfBirth: parseDateOdBirth(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      ssn: parseSsn(object.ssn),
      entries: []
    };
    return newPatientEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
  
};

export const toNewEntry = (object: unknown): Entry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }
  if ('description' in object && 'date' in object && 'specialist' in object && 'type' in object)  {
    if (object.type === "Hospital" && 'discharge' in object) {
      const newEntry: Entry = {
        id: uuid(),
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        type: object.type,
        discharge: parseDischarge(object.discharge)
      };

      if ('diagnosisCodes' in object) {
        newEntry.diagnosisCodes = parseDiagnosisCodes(object);
      }

      return newEntry;
    }

    if (object.type === "OccupationalHealthcare" && 'employerName' in object) {
      const newEntry: Entry = {
        id: uuid(),
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        type: object.type,
        employerName: parseEmployerName(object.employerName)
      };

      if ('diagnosisCodes' in object) {
        newEntry.diagnosisCodes = parseDiagnosisCodes(object);
      }

      if ('sickLeave' in object) {
        newEntry.sickLeave = parseSickLeave(object.sickLeave);
      }
      return newEntry;
    }

    if (object.type === "HealthCheck" && 'healthCheckRating' in object ) {
      const newEntry: Entry = {
        id: uuid(),
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        type: object.type,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      };

      if ('diagnosisCodes' in object) {
        newEntry.diagnosisCodes = parseDiagnosisCodes(object);
      }

      return newEntry;
    }
  }
  throw new Error('Incorrect data: some fields are missing');

};
