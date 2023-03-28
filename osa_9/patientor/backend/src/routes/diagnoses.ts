import express from 'express';
import diagnosesService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diagnosesService.getEntries());
});

router.post('/', (_req, res) => {
  res.send('Saving a diagnosis!');
});

export default router;