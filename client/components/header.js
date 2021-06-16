import Link from 'next/link';
import Image from 'next/image';

const Header = ({ authenticated }) => {
  const links = [
    !authenticated && { label: 'Sign Up', href: '/auth/signup' },
    !authenticated && { label: 'Sign In', href: '/auth/signin' },
    authenticated && { label: 'Sign Out', href: '/auth/signout' },
  ].filter((linkConfig) => linkConfig);

  return (
    <header className='d-flex flex-wrap justify-content-center py-3 px-3 border-bottom'>
      <Link href='/'>
        <a className='d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none'>
          <Image src='/ticket-logo.png' alt='Ticket Logo' width={50} height={50} />
          <span className='fs-4 px-3'>Ticketing App</span>
        </a>
      </Link>

      <ul className='nav nav-pills'>
        {links.map(({ href, label }) => (
          <li key={label} className='nav-item'>
            <Link href={href}>
              <a className='nav-link'>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
};

export default Header;
