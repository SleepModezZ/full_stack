const calculateBmi = (height: number, weight: number): string => {
  const BMI = weight / ((height / 100) ** 2);

  if (BMI < 16) {
    return "Underweight (Severe thinness)";
  }
  if (BMI < 17) {
    return "Underweight (Moderate thinness)";
  }
  if (BMI < 18.5) {
    return "Underweight (Mild thinness)";
  }
  if (BMI < 25) {
    return "Normal (healthy weight)";
  }
  if (BMI < 30) {
    return "Overweight (Pre-obese)";
  }
  if (BMI < 35) {
    return "Obese (Class I)";
  }
  if (BMI < 40) {
    return "0bese (Class II)";
  }

  return "Obese (Class III)";
};

if (process.argv.length > 3) {
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);
  console.log(calculateBmi(height, weight));
}
export default calculateBmi;