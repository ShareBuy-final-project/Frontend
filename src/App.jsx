import React from 'react'
import LoginPage from './pages/LoginPage'
import WelcomePage from './pages/WelcomePage'
import MainLayout from './Layouts/MainLayout'
import HomePage from './Pages/HomePage'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<WelcomePage/>} />
      <Route path='/home' element={<HomePage/>} />
      <Route path="/log-in" element={<LoginPage/>} />
    </Route>
  )
)

const App = () => {
   return <RouterProvider router={router}/>
}

export default App