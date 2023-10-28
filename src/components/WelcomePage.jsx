import React, { useState } from 'react'
import LoginForm from './Login'
import SigninForm from './Signin'

const WelcomePage = ({ handleAuthenticationSuccess, handleSetUser } ) => {
  const [showLogin, setShowLogin] = useState(null)

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-500">
      <h1 className="lg:text-6xl md:text-4xl text-3xl font-bold text-white whitespace-nowrap mb-10 ">Welcome to Shelflife</h1>
      {showLogin === null && (
        <div className="mt-5 space-x-4">
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded"
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded"
          >
            Sign In
          </button>
        </div>
      )}
      {showLogin === true && <LoginForm handleAuthenticationSuccess={handleAuthenticationSuccess} handleSetUser={handleSetUser} showLogin={setShowLogin}/>}
      {showLogin === false && <SigninForm handleAuthenticationSuccess={handleAuthenticationSuccess} handleSetUser={handleSetUser} showLogin={setShowLogin}/>}
    </div>
  )
}

export default WelcomePage
