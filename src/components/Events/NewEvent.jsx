import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import Modal from '../UI/Modal.jsx'
import EventForm from './EventForm.jsx'
import { createNewEvent, queryClient } from '../../util/http.js'
import ErrorBlock from '../UI/ErrorBlock.jsx'

export default function NewEvent() {
  const navigate = useNavigate()

  const { mutate, isPending, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        /* exact mean that query that have exact query key */
        queryKey: ['events'] /* , exact: true */,
      })
      navigate('/events')
    },
  })

  function handleSubmit(formData) {
    mutate({ event: formData })
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {!isPending && (
          <>
            <Link to='../' className='button-text'>
              Cancel
            </Link>
            <button type='submit' className='button' disabled={isPending}>
              Create
            </button>
          </>
        )}
      </EventForm>
      {error && (
        <ErrorBlock
          title={'Failed to create event'}
          message={error.message || 'Failed to fetch events'}
        />
      )}
    </Modal>
  )
}
