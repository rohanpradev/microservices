// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

const interceptorSuccess = (response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  if (response.data && response.data.hasOwnProperty('data')) response.data = response.data.data;
  return Promise.resolve(response);
};

const interceptorFailure = (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
};

const ApiClient = ({ req }) => {
  let axiosInstance;
  if (typeof window === 'undefined') {
    // We are on the server
    axiosInstance = axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    axiosInstance = axios.create();
  }
  axiosInstance.interceptors.response.use(interceptorSuccess, interceptorFailure);
  return axiosInstance;
};

export default ApiClient;
