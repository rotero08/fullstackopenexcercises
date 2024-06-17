/* eslint-disable react/prop-types */
import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_NOTI":
        return action.payload
    case "REMOVE_NOTI":
        return ''
    default:
        return state
  }
}

const AnecdoteContext = createContext()

export const AnecdoteContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')
  
  return (
    <AnecdoteContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </AnecdoteContext.Provider>
  )
}

export default AnecdoteContext
