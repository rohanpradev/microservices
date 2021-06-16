import { useEffect, useState } from 'react';

const ShowOrder = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  return timeLeft < 0 ? (
    <div>Your order has expired</div>
  ) : (
    <div>You have {timeLeft} seconds until order expires</div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const {
    data: { order },
  } = client.get(`/api/orders/${orderId}`);
  return { order };
};

export default ShowOrder;
