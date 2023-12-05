import React from 'react'
import { CiShoppingCart } from 'react-icons/ci'
import {MdOutlineKitchen} from 'react-icons/md'
import axios from 'axios'

const AppNavBar = ({handleAuthenticationSuccess, handleToggleShoppingList, showShoppingList}) => {

  const logoutUser = async () => {
    await axios.get('https://shelflife-backend.onrender.com/logout')
    handleAuthenticationSuccess(false)
  }

  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white p-4 px-6">
      <a href="/" className="text-4xl font-bold flex items-center transition-transform hover:scale-110">
        Shelflife
      </a>
      <div>
      <button
      onClick={()=> logoutUser()}
            className="text-3xl p-4 transition-transform hover:scale-110 hover:bg-red-300 rounded-lg"
          >
            Log out
          </button>
        {showShoppingList ? (
          <button
            onClick={()=> handleToggleShoppingList(showShoppingList)}
            className="text-3xl p-4 transition-transform hover:scale-110 hover:bg-red-300 rounded-lg"
          >
            <MdOutlineKitchen />
          </button>
        ) : (
          // Render the ShoppingCart Icon when showShoppingList is false
          <button
            onClick={()=> handleToggleShoppingList(showShoppingList)}
            className="text-3xl p-4 transition-transform hover:scale-110 hover:bg-red-300 rounded-lg"
          >
            <CiShoppingCart />
          </button>
        )}
      </div>
    </nav>
  )
}

export default AppNavBar
