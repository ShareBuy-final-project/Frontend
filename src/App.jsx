import React from 'react'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import MainLayout from './Layouts/MainLayout'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<HomePage/>} />
      <Route path="/log-in" element={<LoginPage/>} />
    </Route>
  )
)

const App = () => {
   return <RouterProvider router={router}/>
}

export default App