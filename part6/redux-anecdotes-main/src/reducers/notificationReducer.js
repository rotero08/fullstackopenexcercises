import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
        return action.payload
    },
    removeNotification() {
        return ''
    }
  }
})
  
export const { showNotification, removeNotification } = notificationSlice.actions

export const setNotification = (timeoutIdRef, message, duration) => {
  return async dispatch => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    dispatch(showNotification(message))

    timeoutIdRef.current = setTimeout(() => {
      dispatch(removeNotification())
    }, duration*1000)
  }
}

export default notificationSlice.reducer
