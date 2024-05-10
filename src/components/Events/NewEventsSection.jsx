import { useQuery } from '@tanstack/react-query'

import LoadingIndicator from '../UI/LoadingIndicator.jsx'
import ErrorBlock from '../UI/ErrorBlock.jsx'
import EventItem from './EventItem.jsx'

import { fetchEvents } from '../../util/http.js'

export default function NewEventsSection() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    /*
      staleTime: controls after which time react query
      will send such a behind the scenes request to get updated data
      if it found data in your cache.
      default: 0,
      https://www.udemy.com/course/react-the-complete-guide-incl-redux/learn/lecture/39499428#questions/19985512
    */
    // staleTime: 5000,
    /* 
      gcTime(Garbage Collection Time): this controls how long the data
      and the cache will be kept around.
      default: 60000 * 5, 5min
    */
    // gcTime: 1000,
  })
  let content

  if (isLoading) {
    content = <LoadingIndicator />
  }

  if (error) {
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
