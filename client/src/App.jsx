import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signin from './pages/Signin'
import Home from './pages/Home'
import Signout from './pages/Signout'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header'


export default function App() {
  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path='/signin' element={<Signin/>}></Route>
    <Route path='/signout' element={<Signout/>}></Route>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/profile' element={<Profile  />}></Route>
    <Route path='/about' element={<About />}></Route>
  </Routes>
  </BrowserRouter>
  
}
