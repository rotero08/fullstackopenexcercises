interface exerciseDays {
  value1: number;
  value2: number[];
}

const parseArgumentss = (args: string[]): exerciseDays => {
  for (let index = 2; index < args.length; index++) {
    if (isNaN(Number(args[index]))) throw new Error('Provided values were not numbers!');
  }
  return {
    value1: Number(args[2]),
    value2: args.slice(3).map(Number)
  }
}

const calculateExercises = (target: number, days: number[]) => {
  const periodLength = days.length;
  const trainingDays = days.reduce((accumulator, currentValue) => currentValue===0? accumulator : accumulator + 1 , 0);
  const average = days.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / periodLength;
  const success = average>=target? true : false;
  const rating =
    average < target - 0.5 ? 1 :
    average < target ? 2 :
    3;

  const ratingDescription =
    average < target - 0.5 ? 'you can do it, you just need more effort' :
    average < target ? 'not too bad but could be better' :
    'perfect, keep it going';  

  const result = { 
      periodLength: periodLength,
      trainingDays: trainingDays,
      success: success,
      rating: rating,
      ratingDescription: ratingDescription,
      target: target,
      average: average
    };

  return result
}

try {
  const { value1, value2 } = parseArgumentss(process.argv);
    console.log(calculateExercises(value1, value2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
