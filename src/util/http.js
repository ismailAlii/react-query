import axios from 'axios'

export const fetchEvents = async () => {
  try {
    const response = await axios.get('http://localhost:3000/events')
    const { events } = response.data
    return events
  } catch (error) {
    const customError = new Error('An error occurred while fetching the events')
    customError.code = error.response.status
    customError.info = error.response.data
    throw customError
  }
}
