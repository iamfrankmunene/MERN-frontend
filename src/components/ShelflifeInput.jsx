import React, { useState, useEffect } from 'react'
import { BsTrash } from 'react-icons/bs'
import { FiPlus } from 'react-icons/fi'
import AlertSound from '../assets/Alert-sound.wav'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ShelflifeInput = () => {
  const [inputs, setInputs] = useState([{ item: '', date: '', time: '', completed: false }])

  const handleInputChange = (index, event) => {
    const { name, value } = event.target
    const updatedInputs = [...inputs]
    updatedInputs[index] = { ...updatedInputs[index], [name]: value }
    setInputs(updatedInputs)
  }

  const handleAddInput = () => {
    setInputs([...inputs, { item: '', date: '', time: '', completed: false }])
  }
  
  const handleSaveInput = async (input) => {
    try {
  
      // If the input has an _id, it means it already exists in the database, so update it
      if (input._id) {
        await axios.put(`https://zesty-tarsier-5adeee.netlify.app/shelflife/${input._id}`, input)
        toast.success('Successfully updated input in the server')
      } else {
        // If the input doesn't have an _id, it's a new input, so add it to the database
        await axios.post('https://zesty-tarsier-5adeee.netlify.app/shelflife', input)
        toast.success('Successfully added input to the server')
      }
  
      // Fetch all the available information from the backend and update the inputs
      const response = await axios.get('https://zesty-tarsier-5adeee.netlify.app/shelflife')
      const shelflifeInputsData = response.data
      setInputs(shelflifeInputsData)
    } catch (error) {
      toast.error('Error saving Shelflife input.')
    }
  }
  

  const handleDeleteInput = async (index) => {
    try {
      // Get the ID of the input to be deleted
      const idToDelete = inputs[index]._id

      // Send the DELETE request to the backend to delete the input by its ID
      await axios.delete(`https://zesty-tarsier-5adeee.netlify.app/shelflife/${idToDelete}`)

      // Fetch all the available information from the backend and update the inputs
      const response = await axios.get('https://zesty-tarsier-5adeee.netlify.app/shelflife')
      const shelflifeInputsData = response.data
      setInputs(shelflifeInputsData)
    } catch (error) {
      toast.error('Error deleting Shelflife input.')
    }
  }


  //Format date to include '-' instead of '/'
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    const alertSound = new Audio(AlertSound)

    const checkAlerts = async () => {
      try {
        // Fetch the shelflife inputs from the server
        const response = await axios.get('https://zesty-tarsier-5adeee.netlify.app/shelflife')
        const shelflifeInputsData = response.data

        const currentDate = formatDate(new Date())
        const currentTime = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        shelflifeInputsData.forEach((input) => {
          if (currentDate === input.date && currentTime === input.time && !input.completed) {
            alertSound.play()
            window.alert(`Time to check the ${input.item}!`)
            input.completed = true
            handleSaveInput(input) //To update the completed status on the server
          }
        })
      } catch (error) {
        toast.error('Error checking Shelflife inputs.')
      }
    }

    const intervalId = setInterval(checkAlerts, 1000)

    return () => {
      //useEffect returns a cleanup function
      clearInterval(intervalId)
    }
  }, [])
  

  useEffect(() => {
    // Fetch all the available information from the backend and populate the inputs
    const fetchShelflifeInputs = async () => {
      try {
        const response = await axios.get('https://zesty-tarsier-5adeee.netlify.app/shelflife')
        const shelflifeInputsData = response.data
        setInputs(shelflifeInputsData)
      } catch (error) {
        toast.error('Error fetching Shelflife inputs.')
      }
    }

    fetchShelflifeInputs()
  }, [])

 
  return (
    <section className="min-h-[84vh]">
      <ToastContainer />
      <div className="mt-5 flex items-center justify-center">
        <h2 className="font-bold text-2xl">Add an input field</h2>
        <button
          onClick={handleAddInput}
          className="bg-green-500 text-white px-4 py-2 rounded ml-3 transform hover:scale-110"
        >
          <span className="font-bold text-lg">
            <FiPlus />
          </span>
        </button>
      </div>
      <div className="flex flex-col items-center mt-8">
        {inputs.map((input, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col sm:flex-row">
            <input
              type="text"
              name="item"
              value={input.item}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Enter item name"
              className="mr-2 p-2 flex-1 mb-2 sm:mb-0"
            />
            <input
              type="date"
              name="date"
              value={input.date}
              onChange={(e) => handleInputChange(index, e)}
              className="mr-2 p-2 w-full sm:w-auto"
            />
            <input
              type="time"
              name="time"
              value={input.time}
              onChange={(e) => handleInputChange(index, e)}
              className="mr-2 p-2 w-full sm:w-auto"
            />
            <button
              onClick={() => handleDeleteInput(index)}
              className="text-xl hover:text-2xl text-red-700 px-5 py-2 rounded"
            >
              <BsTrash />
            </button>
            {!input.completed && (
              <button
                onClick={() => handleSaveInput(input)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-3"
              >
                {input._id ? 'Update' : 'Add'}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ShelflifeInput
