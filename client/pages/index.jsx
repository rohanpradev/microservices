import Head from 'next/head';
import Link from 'next/link';

const LandingPage = ({ tickets = [] }) => {
  return (
    <>
      <Head>
        <title>Ticketing App</title>
        <meta name='description' content='Generated by Ticketing app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='container mt-5'>
        <div className='row'>
          {tickets.map(({ id, title, price }) => (
            <div key={id} className='col-sm-3'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>{title}</h5>
                  <p className='card-text'>&#8377; {price}</p>
                  <Link href='/tickets/[ticketId]' as={`/tickets/${id}`}>
                    <a className='btn btn-primary'>View details</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const {
    data: { tickets },
  } = await client.get('/api/tickets');
  return { tickets };
};

export default LandingPage;