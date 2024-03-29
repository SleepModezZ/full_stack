import express from 'express';
import diagnosesRouter from './routes/diagnoses';
import patientRouter from './routes/patients';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use('/api/diagnoses', diagnosesRouter);

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use('/api/patients', patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});