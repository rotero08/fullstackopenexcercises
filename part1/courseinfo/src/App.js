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
      <p>{props.part} {props.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <>
    <Part part={props.part[0]} exercises={props.exercises[0]}/>
    <Part part={props.part[1]} exercises={props.exercises[1]}/>
    <Part part={props.part[2]} exercises={props.exercises[2]}/>
    </>
  )
}

const Total = (props) => {
  return (
    <div>
    <p>Number of exercises {props.total}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }
  const parts = [part1.name, part2.name, part3.name]
  const exercises = [part1.exercises, part2.exercises, part3.exercises]

  return (
    <div>
      <Header course={course} />
      <Content part={parts} exercises={exercises} />
      <Total total={part1.exercises + part2.exercises + part3.exercises} />
    </div>
  )
}

export default App
