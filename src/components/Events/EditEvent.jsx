import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'

import Modal from '../UI/Modal.jsx'
import EventForm from './EventForm.jsx'
import { fetchEvent, updateEvent, queryClient } from '../../util/http.js'
import LoadingIndicator from '../UI/LoadingIndicator.jsx'
import ErrorBlock from '../UI/ErrorBlock.jsx'

export default function EditEvent() {
  const navigate = useNavigate()

  const { id } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', { id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  })

  const {
    mutate,
    isPending: isUpdatePending,
    error: updateError,
  } = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events', { id }],
      })
      navigate('../')
    },
  })

  function handleSubmit(formData) {
    mutate({ id, event: formData })
  }

  function handleClose() {
    navigate('../')
  }

  let content

  if (isLoading) {
    content = (
      <div className='center'>
        <LoadingIndicator />
      </div>
    )
  }

  if (error) {
    content = (
      <>
        <ErrorBlock
          title='Failed to load Event'
          message={
            error.info?.message ||
            'Failed to laod event. Please check your inputs and try again later.'
          }
        />
        <div className='form-actions'>
          <Link to='../' className='button'>
            Okay
          </Link>
        </div>
      </>
    )
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {updateError && (
          <ErrorBlock
            title='Could not update Event!'
            message='Something went wrong!'
          />
        )}
        {isUpdatePending && 'Updating...'}
        {!isUpdatePending && (
          <>
            <Link to='../' className='button-text'>
              Cancel
            </Link>
            <button type='submit' className='button'>
              Update
            </button>
          </>
        )}
      </EventForm>
    )
  }

  return <Modal onClose={handleClose}>{content}</Modal>
}
