import { useState } from 'react';
import makeRequest from '../../hooks/makerequest';
import { useRouter } from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const [doRequest, errors] = makeRequest({
    method: 'post',
    body: { title, price },
    url: '/api/tickets',
    onSuccess: () => router.push('/'),
  });
  const router = useRouter();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    doRequest();
  };

  return (
    <div className='container mt-5'>
      <h1>Create a Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group mb-4'>
          <label htmlFor='title'>Title</label>
          <input
            className='form-control'
            type='text'
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group mb-4'>
          <label htmlFor='price'>Price</label>
          <input
            className='form-control'
            name='price'
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <input type='submit' title='Submit' className='btn btn-primary' />
      </form>
    </div>
  );
};

export default NewTicket;
