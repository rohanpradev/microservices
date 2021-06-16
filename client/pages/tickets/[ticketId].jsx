import makeRequest from '../../hooks/makerequest';
import { useRouter } from 'next/router';

const ShowTicket = ({ ticket }) => {
  const router = useRouter();

  const [doRequest, errors] = makeRequest({
    method: 'post',
    url: '/api/orders',
    body: { ticketId: ticket.id },
    onSuccess: ({ data: { order } }) => {
      router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <div className='container mt-5'>
      <h1 className='mb-2'>{ticket.title}</h1>
      <h4 className='mb-3'>{ticket.price}</h4>
      {errors}
      <button onClick={doRequest} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  );
};

ShowTicket.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const {
    data: { ticket },
  } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket };
};

export default ShowTicket;
