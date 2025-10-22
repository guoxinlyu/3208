import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Posts from './pages/Posts.jsx'
import PostDetail from './pages/PostDetail.jsx'
import NewPost from './pages/NewPost.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'posts', element: <Posts /> },
      { path: 'posts/:id', element: <PostDetail /> },
      { path="/register" element={<Register/>} />
        path: 'new',
        element: (
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
