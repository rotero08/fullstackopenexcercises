import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, updateNote } from './requests'
import { useContext } from 'react'
import AnecdotesContext from './AnecdotesContext'

const App = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(AnecdotesContext)

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const handleVote = (anecdote) => {
    updateNoteMutation.mutate({...anecdote, votes: anecdote.votes+1 })
    dispatch({ 
      type: "SHOW_NOTI",
      payload: `anecdote '${anecdote.content}' voted`
     })
    setTimeout(() => {
      dispatch({type: "REMOVE_NOTI"})
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getNotes,
    retry: 1
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
