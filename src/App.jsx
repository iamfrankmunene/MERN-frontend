import React, { useState } from 'react'
import AppNavBar from './components/AppNavBar.jsx'
import AppFooter from './components/AppFooter.jsx'
import ShelflifeInput from './components/ShelflifeInput.jsx'
import ShoppingList from './components/ShoppingList.jsx'
import WelcomePage from './components/WelcomePage.jsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showShoppingList, setShowShoppingList] = useState(false)

  // Callback function to toggle between ShelflifeInput and ShoppingList components
  function handleToggleShoppingList(showShoppingList) {
    setShowShoppingList(!showShoppingList)
  }

  // Callback function to handle successful login or signin
  function handleAuthenticationSuccess() {
    setIsAuthenticated(true)
  }

  return (
    <div>
      {!isAuthenticated && <WelcomePage handleAuthenticationSuccess={handleAuthenticationSuccess} />}

      {isAuthenticated && <AppNavBar
        handleToggleShoppingList={handleToggleShoppingList}
        showShoppingList={showShoppingList}
      />}

      {isAuthenticated && !showShoppingList && <ShelflifeInput />}

      {isAuthenticated && showShoppingList && <ShoppingList />}
      
      <AppFooter />
    </div>
  )
}

export default App
