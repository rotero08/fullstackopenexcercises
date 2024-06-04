import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import noteService from '../services/noteService'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addNote = async (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        const newNote = await noteService.createNew(content)
        dispatch(createNote(newNote))
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
