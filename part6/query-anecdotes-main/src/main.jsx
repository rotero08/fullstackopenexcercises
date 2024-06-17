import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnecdoteContextProvider } from './AnecdotesContext'

import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
      <AnecdoteContextProvider>
        <App />
      </AnecdoteContextProvider>
    </QueryClientProvider>
)
