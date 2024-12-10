import React from 'react'
import HomePage from './pages/HomePage'
import WelcomePage from './pages/WelcomePage'
import RegisterPage from './pages/RegisterPage'
import MainLayout from './Layouts/MainLayout'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<HomePage/>} />
      <Route path="/register" element={<RegisterPage/>} />
    </Route>
  )
)

const App = () => {
   return <RouterProvider router={router}/>
}

export default App