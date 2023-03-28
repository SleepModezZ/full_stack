interface ExerciseResults {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

const calculateExercises = (hours: number[], target: number): ExerciseResults => {
    const average = hours.reduce((a, b) => a + b) / hours.length;
    const trainingDays = hours.filter(h => h > 0).length;
    const result = average / target;

    let rating = 1;
    let description = "bad";

    if (result >= 1) {
        rating = 3;
        description = "not bad at all";
    } else if (result >= 0.5) {
        rating = 2;
        description = "not too bad but could be better";
    }


    return {
        periodLength: hours.length,
        trainingDays: trainingDays,
        success: average >= target,
        rating: rating,
        ratingDescription: description,
        target: target,
        average: average
    };
};

if (process.argv.length > 3) {
    const target = Number(process.argv[2]);
    const arr: number[] = process.argv.slice(3).map(s => Number(s));
    console.log(calculateExercises(arr, target));
}

export default calculateExercises;