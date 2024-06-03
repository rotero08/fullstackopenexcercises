import { useSelector, useDispatch } from 'react-redux'
import { incrementVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, notes}) => {
      if ( filter === '') {
        return notes
      }
      return notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const vote = (id) => {
      dispatch(incrementVote(id))
    }

    return (
        <div>
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
        </div>
    )
}

export default AnecdoteList
