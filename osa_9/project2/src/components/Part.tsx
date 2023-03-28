import { CoursePart} from '../types'

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface TotalProps {
  part: CoursePart;
}

const Part = (props: TotalProps) => {
  const item = props.part

  switch (item.kind) {
    case "basic":
      return (
        <div>
          <p><b>{item.name} {item.exerciseCount}</b><br/><i>{item.description}</i></p>
        </div>
      );
    case "background":
      return (
        <div>
          <p><b>{item.name} {item.exerciseCount}</b><br/><i>{item.description}</i><br/>submit to {item.backroundMaterial}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <p><b>{item.name} {item.exerciseCount}</b><br/>project exercises {item.groupProjectCount}</p>
        </div>
      );
      case "special":
        return (
          <div>
            <p><b>{item.name} {item.exerciseCount}</b><br/><i>{item.description}</i><br/>required skills: {item.requirements.join(", ")}</p>
          </div>
        );
    default:
      return assertNever(item);
      break;
  }


}

export default Part