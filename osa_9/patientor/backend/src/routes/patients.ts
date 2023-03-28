import express from 'express';
import patientService from '../services/patientService';
import { toNewPatientEntry, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  res.send(patientService.getPatient(req.params.id));
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});


router.post('/:id/entries', (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  try {
    const patient = patientService.getPatient(id);
    if (!patient) {
      throw new Error('No patient with that id!');
    }
    patient.entries.push(toNewEntry(req.body));
    patientService.updatePatient(id, patient);
    res.json(patient);
  } catch (error: unknown) {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;