import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/signin.module.css';
import useRequest from '../../hooks/makerequest';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [makeRequest, errors] = useRequest({
    method: 'post',
    url: '/api/users/signup',
    body: { email, password },
    onSuccess: () => router.push('/'),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await makeRequest();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className='mb-3'>Sign Up</h3>
      <div className='mb-3'>
        <label htmlFor='email' className='form-label'>
          Email address
        </label>
        <input
          id='email'
          name='email'
          type='email'
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby='emailHelp'
        />
        <div id='emailHelp' className='form-text'>
          We'll never share your email with anyone else.
        </div>
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label'>
          Password
        </label>
        <input
          type='password'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='form-control'
          id='password'
        />
      </div>
      {errors}
      <button type='submit' className='btn btn-primary'>
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
