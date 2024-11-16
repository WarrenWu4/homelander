import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Login'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  }, 
  {
    path: "/user",
    element: <App />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)