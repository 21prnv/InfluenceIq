import React from 'react'
import Regsiter from './Regsiter'
import SignIn from './SignIn'
import {  Route , Routes, useLocation } from 'react-router-dom'
import Home from './Home'
import Profile from './NavElments/Profile'
import BrowseExercise from './BrowseExercise'
import MuscleExercises from './Muscles/Muscles'
import { useState,useEffect } from 'react'
import Loader from './Loader'
import Plans from './Plans'
import Classic from './Plans/Classic'
import PPL from './Plans/PPL'
import UL from './Plans/UL'
import Fullbody from './Plans/Fullbody'
import Power from './Plans/Power'
import Endurance from './Plans/Endurance'

const App = () => {
  const [loading, setLoading] = useState(false)
  const location = useLocation

  useEffect(() =>{
    setLoading(true)

    const timer = setTimeout(() => setLoading(false),800)

    return () => clearTimeout(timer)
  },[location])

  return (
    <div>
      {loading&&<Loader/>}
      <Routes>
        <Route path="/" element={<Regsiter/>} ></Route>
        <Route path="/register" element={<Regsiter/>} ></Route>
        <Route path="/login" element={<SignIn/>} ></Route>
        <Route path="/home" element={<Home/>} ></Route>
        <Route path="/profile" element={<Profile/>} ></Route>
        <Route path="/muscle" element={<BrowseExercise/>} ></Route>
        <Route path="/muscle/:muscle" element={<MuscleExercises/>} ></Route>
        <Route path="/plans/:plans" element={<Classic/>} ></Route>
        <Route path="/plans" element={<Plans/>} ></Route>
        <Route path="/plans/:plans" element={<PPL/>} ></Route>
        <Route path="/plans/:plans" element={<UL/>} ></Route>
        <Route path="/plans/:plans" element={<Fullbody/>} ></Route>
        <Route path="/plans/:plans" element={<Power/>} ></Route>
        <Route path="/plans/:plans" element={<Endurance/>} ></Route>
      </Routes>
    
    </div>
  )
}

export default App
