import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {


    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    const bmi = calculateBmi(height, weight);

    if (!height || !weight) {
        console.log(height, weight);
        res.send({
            error: "malformatted parameters"
        });
        return;
    }
    res.send({
        weight: weight,
        height: height,
        bmi: bmi
    });
});

app.post('/exercises', (req, res) => {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { target, daily_exercises } = req.body;

    if (!target || !daily_exercises) {
        res.send({
            error: "parameters missing"
        });
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isNaN(target) || !Array.isArray(daily_exercises) || !daily_exercises.every((h: number) => !isNaN(h))) {
        res.send({
            error: "malformatted parameters"
        });
        return;
    }


    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = calculateExercises(daily_exercises.map(h => Number(h)), target);
    res.send({
        "periodLength": result.periodLength,
        "trainingDays": result.trainingDays,
        "success": result.success,
        "rating": result.rating,
        "ratingDescription": result.ratingDescription,
        "target": result.target,
        "average": result.average
    });

});

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});