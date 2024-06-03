import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addNote = (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        dispatch(createNote(content))
        dispatch(setNotification(`You added '${content}'`))
        setTimeout(() => {
            dispatch(removeNotification())
        }, 5000)
    }
    
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addNote}>
                <div><input name='note'/></div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm
