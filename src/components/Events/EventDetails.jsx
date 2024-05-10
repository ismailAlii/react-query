import { useState } from 'react'

import { Link, Outlet, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'

import Header from '../Header.jsx'
import { fetchEvent, deleteEvent, queryClient } from '../../util/http.js'
import ErrorBlock from '../UI/ErrorBlock.jsx'
import Modal from '../UI/Modal.jsx'

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', { id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  })

  const {
    mutate,
    isPending: isDeletePending,
    error: deleteError,
  } = useMutation({
    mutationFn: () => deleteEvent({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        /* 
          When we delete event and validate all queries
          we get 404 error cuz the event we just detelted is not there anymore
          to fix that we change refetchType: 'none,
          and this will prevent imediate trigger.
        */
        refetchType: 'none',
      })
      navigate('/events')
    },
  })

  function handleStartDelete() {
    setIsDeleting(true)
  }

  function handleStopDelete() {
    setIsDeleting(false)
  }

  function handleDelete() {
    mutate({ id })
  }

  let content

  if (isLoading) {
    content = (
      <div id='event-details-content' className='center'>
        <p>Fetching event data...</p>
      </div>
    )
  }

  if (error) {
    content = (
      <div id='event-details-content' className='center'>
        <ErrorBlock
          title='Failed to load event'
          message={
            error.info?.message ||
            'Failed to fetch event data, please try again later.'
          }
        />
      </div>
    )
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to='edit'>Edit</Link>
          </nav>
        </header>
        <div id='event-details-content'>
          <img src={`http://localhost:3000/${data.image}`} alt='' />
          <div id='event-details-info'>
            <div>
              <p id='event-details-location'>{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {data.date} | {data.time}
              </time>
            </div>
            <p id='event-details-description'>{data.description}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>
            Do you really want to delete this event? This action cannot be
            undone.
          </p>
          <div className='form-actions'>
            {isDeletePending && <p>Deleting, please wait...</p>}
            {!isDeletePending && (
              <>
                <button onClick={handleStopDelete} className='button-text'>
                  Cancel
                </button>
                <button onClick={handleDelete} className='button'>
                  Delete
                </button>
              </>
            )}
          </div>
          {deleteError && (
            <ErrorBlock
              title='Failed to delete event'
              message={
                deleteError.info?.message ||
                'Failed to delete event, please try again later.'
              }
            />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to='/events' className='nav-item'>
          View all Events
        </Link>
      </Header>
      <article id='event-details'>{content}</article>
    </>
  )
}
