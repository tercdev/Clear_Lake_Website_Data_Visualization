import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdownStream, setDropdownStream] = useState(false);
  const [dropdownMet, setDropdownMet] = useState(false);

  const [clickDropdown, setClickDropdown] = useState(false);

  const handleClickDropdown = () => setClick(!click);


  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnterStream = () => {
    if (window.innerWidth < 960) {
      setDropdownStream(false);
      setDropdownMet(false);
    } else {
      setDropdownStream(true);
    }
  };

  const onMouseLeaveStream = () => {
    if (window.innerWidth < 960) {
      setDropdownStream(false);
    } else {
      setDropdownStream(false);
    }
  };

  const onMouseEnterMet = () => {
    if (window.innerWidth < 960) {
      setDropdownMet(false);
    } else {
      setDropdownMet(true);
    }
  };

  const onMouseLeaveMet = () => {
    if (window.innerWidth < 960) {
      setDropdownMet(false);
    } else {
      setDropdownMet(false);
    }
  };

  return (
    <div>
      
      <nav className='navbar'>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
           <li className='nav-item'>
             <Link to='/' className='nav-links' onClick={closeMobileMenu}>
               Home
             </Link>
           </li>
           <li className='nav-item' onMouseEnter={onMouseEnterStream} onMouseLeave={onMouseLeaveStream}>
             <Link to='/stream' className='nav-links' onClick={closeMobileMenu} >
               Stream <i className="fas fa-caret-down" />
             </Link>
             {dropdownStream ?
             <ul onClick={handleClickDropdown} className={clickDropdown ? 'dropdown-menu clicked' : 'dropdown-menu'}>
             
              <li >
                <Link className='dropdown-link' to='/kelsey' onClick={() => setClickDropdown(false)} >
                  Kelsey
                </Link>
              </li>
              <li >
                <Link className='dropdown-link' to='/middle' onClick={() => setClickDropdown(false)} >
                  Middle
                </Link>
              </li>
              <li>
                <Link className='dropdown-link' to='/scotts' onClick={() => setClickDropdown(false)} >
                  Scotts
                </Link>
              </li>
            </ul>
              
            : ''}
           </li>

           <li className='nav-item' onMouseEnter={onMouseEnterMet} onMouseLeave={onMouseLeaveMet}>
             <Link to='/stream' className='nav-links' onClick={closeMobileMenu} >
               Meteorology <i className="fas fa-caret-down" />
             </Link>
             {dropdownMet ?
              <ul onClick={handleClickDropdown} className={clickDropdown ? 'dropdown-menu clicked' : 'dropdown-menu'}>
              
                <li >
                  <Link className='dropdown-link' to='/kelsey' onClick={() => setClickDropdown(false)} >
                    bkp
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/middle' onClick={() => setClickDropdown(false)} >
                    jb
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/scotts' onClick={() => setClickDropdown(false)} >
                    nw
                  </Link>
                </li>
              </ul>
                
              : ''}
           </li>
           
           <li className='nav-item'>
             <Link to='/contact-us' className='nav-links' onClick={closeMobileMenu}>
               Contact Us
             </Link>
           </li>
           
        </ul>

      </nav>

    </div>
  )
}

export default Navbar;