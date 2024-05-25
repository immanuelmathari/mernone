import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  // now we working on searching
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // tp get the url Parameters - to get url data,
    const urlParams = new URLSearchParams(window.location.search); // we get the information in the url
    urlParams.set('searchTerm', searchTerm);
    // convert the urlParams to string bcz some are numbers
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // we want a useeffect to set setSearchTerm the value in the url everytime it is loaded afresh
  // if location.search changes we want to update our search term
  // results we see what is changed in the url in the form input
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])
  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold'>Auth App</h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center' onSubmit={handleSubmit}>
          <input type='text' placeholder='Search ....' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button>
          <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li>Home</li>
          </Link>
          <Link to='/about'>
            <li>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img src={currentUser.avatar} alt='profile' className='h-7 w-7 rounded-full object-cover' />
              // <p>{currentUser.avatar}</p>
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
