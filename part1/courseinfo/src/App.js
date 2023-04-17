const Header = (props) => {
  return (
    <>
    <h1>{props.course}</h1>
    </>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.name} {props.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <>
    <Part name={props.part[0].name} exercises={props.part[0].exercises}/>
    <Part name={props.part[1].name} exercises={props.part[1].exercises}/>
    <Part name={props.part[2].name} exercises={props.part[2].exercises}/>
    </>
  )
}

const Total = (props) => {
  let total = props.total[0].exercises + props.total[1].exercises + props.total[2].exercises
  return (
    <div>
    <p>Number of exercises {total}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content part={course.parts} />
      <Total total={course.parts} />
    </div>
  )
}

export default App
