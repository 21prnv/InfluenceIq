import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.post('http://localhost:3000/register',{name, email, password})
            .then(result =>{
                if(result.data.message === "You are signed up"){
                    navigate('/login')
                } else {
                    setErrorMessage(result.data.message)
                }
            })
            .catch(err =>{
                console.error("Error During Registraion", err.response?.data?.message || err.message)
                setErrorMessage("An error occurred during registration. Please try again.") 
            })
    }

  return (
    <div className="flex">
      <div className="bg-white transition-all duration-1000 ease-in-out md:w-[100%] h-screen w-0">
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Yellow background image" 
          className="object-cover h-full w-full" 
        />
      </div>

      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded-2xl w-full h-full md:w-1/2 bg-white p-8">
          <div className="flex items-center gap-4 mb-6">
            <img 
              className="w-16 h-16" 
              src="https://pbs.twimg.com/media/Gbg0yNhaQAAGV47?format=png&name=small" 
              alt="FitTrack Logo" 
            />
            <h1 className="font-bold text-4xl">FitTrack</h1>
          </div>

          <div className="border-b-4 border-gray-500 w-72 mb-6"></div>

          <h2 className="font-bold text-3xl text-gray-700 mb-6">Register</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-600 mb-1">Name:</label>
              <input 
                type="text" 
                placeholder="Enter Your Name" 
                className="border border-gray-300 w-80 shadow-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                onChange={(e) => setName(e.target.value)}

              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-600 mb-1">Email:</label>
              <input 
                type="email" 
                placeholder="Enter Your Email" 
                className="border border-gray-300 w-80 shadow-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-600 mb-1">Password:</label>
              <input 
                type="password" 
                placeholder="Enter Your Password" 
                className="border border-gray-300 w-80 shadow-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && (<p className="text-red-500 text-center text-sm">{errorMessage}</p>)}
            <button className="bg-black text-white font-semibold rounded-xl p-2 w-80 mt-4 hover:bg-gray-600 transform hover:scale-105 transition duration-200 ease-in-out">
                Register
            </button>

            <div className="flex justify-center mt-4">
              <p className="text-gray-600">Already have an account?&nbsp;</p>
              <Link to="/login" className="text-blue-600 cursor-pointer hover:underline">Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
