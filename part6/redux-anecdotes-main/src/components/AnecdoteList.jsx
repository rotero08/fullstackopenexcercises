import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { incrementVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const timeoutIdRef = useRef()

    const anecdotes = useSelector(({ filter, notes}) => {
      if ( filter === '') {
        return notes
      }
      return notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const vote = (anecdote) => {
      dispatch(incrementVote(anecdote))
      dispatch(setNotification(timeoutIdRef, `You voted '${anecdote.content}'`, 5))
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
                  <button onClick={() => vote(anecdote)}>vote</button>
                </div>
              </div>
          )}
        </div>
    )
}

export default AnecdoteList
