
import diagnosesData from '../../data/diagnoses';
import { DiagnosisEntry } from '../types';

const diagnoses: DiagnosisEntry[] = diagnosesData;

const getEntries = () => {
  return diagnoses;
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};