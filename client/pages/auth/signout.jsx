import { useEffect } from 'react';
import { useRouter } from 'next/router';
import makeRequest from '../../hooks/makerequest';

const SignOut = () => {
  const router = useRouter();

  const [doRequest] = makeRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out........</div>;
};

export default SignOut;
