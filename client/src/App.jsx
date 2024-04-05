import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signin from './pages/Signin'
import Home from './pages/Home'
import Signout from './pages/Signout'
import Profile from './pages/Profile'


export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/signin' element={<Signin/>}></Route>
    <Route path='/signout' element={<Signout/>}></Route>
    <Route path='/home' element={<Home/>}></Route>
    <Route path='/profile' element={<Profile  />}></Route>
    <Route path='/about' element={<About />}></Route>
  </Routes>
  </BrowserRouter>
}
