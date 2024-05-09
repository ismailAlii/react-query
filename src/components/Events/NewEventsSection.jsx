import { useQuery } from '@tanstack/react-query'

import LoadingIndicator from '../UI/LoadingIndicator.jsx'
import ErrorBlock from '../UI/ErrorBlock.jsx'
import EventItem from './EventItem.jsx'

import { fetchEvents } from '../../util/http.js'

export default function NewEventsSection() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })
  let content

  if (isLoading) {
    content = <LoadingIndicator />
  }

  if (error) {
    console.log(error)
    content = (
      <ErrorBlock
        title={error.code || 'An error occurred'}
        message={error.message || 'Failed to fetch events'}
      />
    )
  }

  if (data) {
    content = (
      <ul className='events-list'>
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className='content-section' id='new-events-section'>
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  )
}
