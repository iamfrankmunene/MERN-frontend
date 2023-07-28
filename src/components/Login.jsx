import React, { useState } from 'react'
import axios from 'axios'

const LoginForm = ({ handleAuthenticationSuccess, showLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleNameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Call the backend API to login the user
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      })

      // Authentication successful
      handleAuthenticationSuccess(true)

      // Reset the form after successful login
      setUsername('')
      setPassword('')
      setErrorMessage('') // Clear any previous error message on successful login
    } catch (error) {
      // Authentication failed
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message)
      } else {
        setErrorMessage('Authentication failed. Please try again later.')
      }
    }
  }


  return (
    <div>
      <form
        className="flex flex-col items-center bg-white rounded-lg shadow p-6 w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            UserName:
          </label>
          <input
            type="text"
            id="name"
            value={username}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border rounded mt-1"
            autoComplete="off" 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded mt-1"
            autoComplete="off" 
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
      <button 
        onClick={() => showLogin(null)} 
        className="px-6 py-3 mt-3 text-white bg-red-500 hover:bg-red-600 rounded"
      >
        Back
      </button>
    </div>
  )
}

export default LoginForm
