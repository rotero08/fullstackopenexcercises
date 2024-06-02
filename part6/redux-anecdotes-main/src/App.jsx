import { useSelector, useDispatch } from 'react-redux'
import { createNote, incrementVote } from './reducers/anecdoteReducer'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(incrementVote(id))
  }

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addNote}>
        <div><input name='note'/></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default App
