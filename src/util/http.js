import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

// Create a client
export const queryClient = new QueryClient()

export const fetchEvents = async ({ signal, searchTerm }) => {
  try {
    let url = 'http://localhost:3000/events'
    if (searchTerm) {
      url += `?search=${searchTerm}`
    }
    const response = await axios.get(url, { signal })
    const { events } = response.data
    return events
  } catch (error) {
    const customError = new Error('An error occurred while fetching the events')
    customError.code = error.response.status
    customError.info = error.response.data
    throw customError
  }
}

export const createNewEvent = async (eventData) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/events',
      eventData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const { event } = response.data
    return event
  } catch (error) {
    const customError = new Error('An error occurred while creating the event')
    customError.code = error.response.status
    customError.info = error.response.data
    throw customError
  }
}

export const fetchSelectableImages = async ({ signal }) => {
  try {
    const response = await axios.get(`http://localhost:3000/events/images`, {
      signal,
    })
    const { images } = await response.data
    return images
  } catch (error) {
    const customError = new Error('An error occurred while fetching the images')
    customError.code = error.response.status
    customError.info = error.response.data
    throw customError
  }
}

export const fetchEvent = async ({ id, signal }) => {
  try {
    const response = await axios.get(`http://localhost:3000/events/${id}`, {
      signal,
    })
    const { event } = await response.data

    return event
  } catch (error) {
    const customError = new Error('An error occurred while fetching the event')
    customError.code = error.response.status
    customError.info = error.response.data
    throw customError
  }
}

export const deleteEvent = async ({ id }) => {
  try {
    const response = await axios.delete(`http://localhost:3000/events/${id}`)
    return response.data
  } catch (error) {
    const customError = new Error('An error occurred while deleting the event')
    customError.code = error.response.status
    customError.info = error.response.data
    throw customError
  }
}

export const updateEvent = async ({ id, event }) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/events/${id}`,
      { event },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    const customError = new Error('An error occurred while updating the event')
    customError.code = error.response.status
    customError.info = error.response.data
    throw customError
  }
}
