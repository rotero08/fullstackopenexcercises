import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '../requests'
import { useContext } from 'react'
import AnecdoteContext from '../AnecdotesContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(AnecdoteContext)

  const newNoteMutation = useMutation({ 
    mutationFn: createNote, 
    onSuccess: () => {queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  }})

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newNoteMutation.mutate({ content, votes: 0 })
    dispatch({ 
      type: "SHOW_NOTI",
      payload: `You added '${content}'`
     })
    setTimeout(() => {
      dispatch({type: "REMOVE_NOTI"})
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
