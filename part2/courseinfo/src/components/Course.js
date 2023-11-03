const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
};

const Part = (props) => {
  return (
    <div>
      <p>
        {props.name} {props.exercises}
      </p>
    </div>
  );
};

const Content = (props) => {
  return (
    <>
      <Part name={props.part[0].name} exercises={props.part[0].exercises} />
      <Part name={props.part[1].name} exercises={props.part[1].exercises} />
      <Part name={props.part[2].name} exercises={props.part[2].exercises} />
    </>
  );
};

const Total = (props) => {
  const total = props.total.reduce((sum, part) => {
    return sum + part.exercises;
  }, 0);

  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content part={course.parts} />
      <Total total={course.parts} />
    </div>
  );
};

export default Course;
