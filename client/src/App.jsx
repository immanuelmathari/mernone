import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signin from './pages/Signin'
import Home from './pages/Home'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header'
import Signup from './pages/Signup'
import PrivateRoute from './components/PrivateRoute'


export default function App() {
  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path='/signin' element={<Signin/>}></Route>
    <Route path='/signup' element={<Signup/>}></Route>
    <Route path='/' element={<Home/>}></Route>
    <Route element={<PrivateRoute/>}>
    <Route path='/profile' element={<Profile  />}/>
    </Route>
    <Route path='/about' element={<About />}></Route>
  </Routes>
  </BrowserRouter>
  
}
