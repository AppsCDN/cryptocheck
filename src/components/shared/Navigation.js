import './navigation.scss';
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <h1>
        <Link to='/'>Cryptocheck</Link>
      </h1>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/check'>Check</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
