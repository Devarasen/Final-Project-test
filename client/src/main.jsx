import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import CommunityBoard from './pages/CommunityBoard.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Profile from './pages/Profile.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />
      }, 
      {
        path: '/community',
        element: <CommunityBoard />
      },
      {
        path: '/profile/',  
        element: <Profile />
      }

    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
