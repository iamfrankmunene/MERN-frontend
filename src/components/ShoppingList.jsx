import React, { useState, useEffect } from 'react'
import { FiPlus } from 'react-icons/fi'
import { BsTrash } from 'react-icons/bs'
import ShoppingBackground from '../../img/ShoppingBackground.jpg'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ShoppingListHistory from './ShoppingListHistory'

const ShoppingList = () => {
  const [lists, setLists] = useState([{ name: '', completed: false }])
  const [shoppingHistory, setShoppingHistory] = useState([])
  const [showShoppingListHistory, setShowShoppingListHistory] = useState(false)

  // Fetch shopping list and shopping history from the server
  useEffect(() => {
    fetchShoppingList()
    fetchShoppingListHistory()
  }, [])

  const fetchShoppingList = async () => {
    try {
      const response = await axios.get('https://shelflife-backend.onrender.com/shoppingList')
      setLists(response.data)
    } catch (error) {
      toast.error('Error fetching shopping list.')
    }
  }

  const fetchShoppingListHistory = async () => {
    try {
      const response = await axios.get('https://shelflife-backend.onrender.com/shoppingHistory')
      setShoppingHistory(response.data)
    } catch (error) {
      toast.error('Error fetching shopping history.')
    }
  }

  const handleInputChange = (itemIndex, event) => {
    const { name, value } = event.target
    const updatedLists = [...lists]
    try {
      // Find the item to be updated
      const itemToUpdate = updatedLists[itemIndex]
      if (itemToUpdate) {
        // Update the item's name
        itemToUpdate[name] = value
        setLists(updatedLists)
      } else {
        toast.error('Item not found in the list:', itemIndex)
      }
    } catch (error) {
      toast.error('Error:', error)
    }
  }

  const handleCheckboxChange = async (itemId) => {
    try {
      const updatedListsCopy = lists.map((item) =>
        item._id === itemId
          ? {
              ...item,
              completed: !item.completed,
              crossedOutDate: item.completed ? new Date(): null,
            }
          : item
      )

      const updatedItem = updatedListsCopy.find((item) => item._id === itemId)

      await axios.put(`https://shelflife-backend.onrender.com/shoppingList/${itemId}`, {
        completed: updatedItem.completed,
        crossedOutDate: updatedItem.crossedOutDate,
      })

      setLists(updatedListsCopy)
      fetchShoppingListHistory()
    } catch (error) {
      toast.error('Error updating item.')
    }
  }

  const handleAddNewItem = () => {
    const newItem = { name: '', completed: false }
    setLists((prevLists) => [newItem, ...prevLists])
  }

  const handleDeleteItem = async (itemIndex) => {
    const itemToDelete = lists[itemIndex]
    
    if (!itemToDelete.completed) {
      // If the item is not completed, delete it from the database
      try {
        await axios.delete(`https://shelflife-backend.onrender.com/shoppingList/${itemToDelete._id}`)
        // Fetch the updated shopping list after deletion
        fetchShoppingList()
        toast.success('Item deleted successfully.')
      } catch (error) {
        toast.error('Error deleting item.')
      }
    } else {
      // If the item is completed, delete it from the frontend only
      const updatedLists = [...lists]
      updatedLists.splice(itemIndex, 1)
      setLists(updatedLists)
      toast.success('Item removed successfully.')
    }
  }
  

  const handleDeleteFromHistory = async (itemId) => {
    // Frontend delete
    const updatedShoppingHistory = shoppingHistory.filter((item) => item._id !== itemId)
    setShoppingHistory(updatedShoppingHistory)

    // Backend delete
    try {
      await axios.delete(`https://shelflife-backend.onrender.com/shoppingHistory/${itemId}`)
    } catch (error) {
      toast.error('Error deleting item from shopping history.')
    }
  }

  const handleShoppingHistoryToggle = () => {
    setShowShoppingListHistory((prevState) => !prevState)
  }

  const handleAddToDatabase = async (itemIndex) => {
    const newItem = lists[itemIndex]
    try {
      // Send the POST request to the backend to add the new item
      const response = await axios.post('https://shelflife-backend.onrender.com/shoppingList', newItem)
      // Update the frontend state with the newly added item
      setLists((prevLists) => {
        const updatedLists = [...prevLists]
        updatedLists[itemIndex] = response.data
        return updatedLists
      })
      toast.success('Item added successfully.')
    } catch (error) {
      toast.error('Error, Please try again later.')
    }
  }

  return (
    <section
      className="min-h-[84vh] w-screen bg-black bg-opacity-50 bg-repeat flex flex-col items-center p-10"
      style={{ backgroundImage: `url(${ShoppingBackground})`, backgroundSize: 'auto' }}
    >
      <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-300 to-purple-800 bg-clip-text">
        Shopping List
      </h2>
      <button
        onClick={handleShoppingHistoryToggle}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-3"
      >
        {showShoppingListHistory ? 'Back To Shopping List' : 'Your Shopping History'}
      </button>

      {/* Render the ShoppingListHistory component conditionally */}
      {showShoppingListHistory ? (
        <ShoppingListHistory
          shoppingHistory={shoppingHistory}
          handleDeleteFromHistory={handleDeleteFromHistory}
        />
      ) : (
        <>
          {/* Add an Item Button */}
          <div className="flex items-center mt-2">
            <h2 className="font-bold text-2xl mr-2">Add an Item</h2>
            <button
              onClick={handleAddNewItem}
              className="bg-green-500 text-white px-4 py-2 rounded transform hover:scale-110"
            >
              <FiPlus />
            </button>
          </div>

          {/* Shopping List */}
          <div className="flex flex-col items-center mt-6">
            {lists.map((item, itemIndex) => (
              <div
                key={item._id}
                className={`bg-white shadow-md rounded-lg p-4 mb-4 flex items-center ${
                  item.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleCheckboxChange(item._id)}
                  className="mr-2"
                />
                <input
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={(e) => handleInputChange(itemIndex, e)}
                  placeholder="Enter item name"
                  className="mr-2 p-2 flex-1"
                />
                <button
                  onClick={() => handleAddToDatabase(itemIndex)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-3"
                >
                  Add
                </button>
                <button
                  onClick={() => handleDeleteItem(itemIndex)}
                  className="text-xl hover:text-2xl text-red-700 px-5 py-2 rounded"
                >
                  <BsTrash />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <ToastContainer />
    </section>
  )
}

export default ShoppingList
