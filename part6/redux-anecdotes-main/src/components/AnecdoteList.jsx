import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { incrementVote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const timeoutIdRef = useRef()

    const anecdotes = useSelector(({ filter, notes}) => {
      if ( filter === '') {
        return notes
      }
      return notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const showNotification = (message, duration = 5000) => {
      return dispatch => {
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current)
        }
    
        dispatch(setNotification(message))
    
        timeoutIdRef.current = setTimeout(() => {
          dispatch(removeNotification())
        }, duration)
      }
    }

    const vote = (anecdote) => {
      dispatch(incrementVote(anecdote))
      dispatch(showNotification(`You voted '${anecdote.content}'`))
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
