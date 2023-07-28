import React from 'react'

const ShoppingListHistory = ({ shoppingHistory, handleDeleteFromHistory }) => {
  return (
    <div className="mt-5">
      {shoppingHistory.length > 0 ? (
        <ul>
          {shoppingHistory.map((item) => (
            <li key={item._id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center">
              {item.name} - Bought on{' '}
              {new Date(item.crossedOutDate).toLocaleDateString()}
              <button
                onClick={() => handleDeleteFromHistory(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-3"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No History</p>
      )}
    </div>
  )
}

export default ShoppingListHistory
