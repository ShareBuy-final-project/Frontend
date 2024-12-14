import React from 'react'
import HomePage from './pages/HomePage'
import WelcomePage from './pages/WelcomePage'
import RegisterPage from './pages/RegisterPage'
import CreateGroupPage from './pages/CreateGroupPage'
import UserProfilePage from './pages/UserProfilePage'
import RegisterBusinessPage from './pages/RegisterBusinessPage'
import MainLayout from './Layouts/MainLayout'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<HomePage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/create-group" element={<CreateGroupPage/>} />
      <Route path="/user-profile" element={<UserProfilePage/>} />
      <Route path="/registerBusiness" element={<RegisterBusinessPage/>} />
    </Route>
  )
)

const App = () => {
   return <RouterProvider router={router}/>
}

export default App