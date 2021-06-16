import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ method, url, body, onSuccess = null }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const { data } = await axios[method](url, body);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => (
              <li key={err.message}> {err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return [doRequest, errors];
};

export default useRequest;
