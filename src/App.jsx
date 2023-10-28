import React, { useState } from 'react'
import AppNavBar from './components/AppNavBar.jsx'
import AppFooter from './components/AppFooter.jsx'
import ShelflifeInput from './components/ShelflifeInput.jsx'
import ShoppingList from './components/ShoppingList.jsx'
import WelcomePage from './components/WelcomePage.jsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [user_id, setUser_id] = useState(null)

  // Callback function to toggle between ShelflifeInput and ShoppingList components
  function handleToggleShoppingList(showShoppingList) {
    setShowShoppingList(!showShoppingList)
  }

   // Callback function to set the user_id when the user logs in
   function handleSetUser(user_id) {
    setUser_id(user_id);
  }

  // Callback function to handle successful login or signin
  function handleAuthenticationSuccess() {
    setIsAuthenticated(true)
  }

  return (
    <div>
      {!isAuthenticated && <WelcomePage handleAuthenticationSuccess={handleAuthenticationSuccess} handleSetUser={handleSetUser}/>}

      {isAuthenticated && <AppNavBar
      handleAuthenticationSuccess={handleAuthenticationSuccess}
        handleToggleShoppingList={handleToggleShoppingList}
        showShoppingList={showShoppingList}
      />}

      {isAuthenticated && !showShoppingList && <ShelflifeInput user_id={user_id}/>}

      {isAuthenticated && showShoppingList && <ShoppingList user_id={user_id}/>}
      
      <AppFooter />
    </div>
  )
}

export default App
