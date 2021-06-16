import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/header';
import apiClient from './api/apiclient';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header authenticated={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = apiClient(appContext.ctx);
  const { data = {} } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  const currentUserDetails = data;
  return { ...currentUserDetails, pageProps };
};

export default AppComponent;
