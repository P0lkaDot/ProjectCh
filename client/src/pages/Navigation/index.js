import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <div>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/NewReceipts'>New Receipts</Link>
        </li>
        <li>
          <Link to='/Sklad'>Sklad</Link>
        </li>
        <li>
          <Link to='/DeletePage'>Delete Page</Link>
        </li>
      </ul>
    </div>
  );
}
