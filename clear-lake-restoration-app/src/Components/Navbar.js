import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdownStream, setDropdownStream] = useState(false);
  const [dropdownMet, setDropdownMet] = useState(false);
  const [dropdownLake, setDropdownLake] = useState(false);

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

  const onMouseEnterLake = () => {
    if (window.innerWidth < 960) {
      setDropdownLake(false);
    } else {
      setDropdownLake(true);
    }
  };

  const onMouseLeaveLake = () => {
    if (window.innerWidth < 960) {
      setDropdownLake(false);
    } else {
      setDropdownLake(false);
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
             <Link to='/met' className='nav-links' onClick={closeMobileMenu} >
               Meteorology <i className="fas fa-caret-down" />
             </Link>
             {dropdownMet ?
              <ul onClick={handleClickDropdown} className={clickDropdown ? 'dropdown-menu clicked' : 'dropdown-menu'}>
              
                <li >
                  <Link className='dropdown-link' to='/nic' onClick={() => setClickDropdown(false)} >
                    Nice
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/nlp' onClick={() => setClickDropdown(false)} >
                    North Lakeport
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/bvr' onClick={() => setClickDropdown(false)} >
                    Big Valley Rancheria
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/bkp' onClick={() => setClickDropdown(false)} >
                    Buckingham Point
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/knb' onClick={() => setClickDropdown(false)} >
                    Konocti Bay
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/clo' onClick={() => setClickDropdown(false)} >
                    Clearlake Oaks
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/jgb' onClick={() => setClickDropdown(false)} >
                    Jago Bay
                  </Link>
                </li>
              </ul>
                
              : ''}
           </li>
           
           <li className='nav-item' onMouseEnter={onMouseEnterLake} onMouseLeave={onMouseLeaveLake}>
             <Link to='/lake' className='nav-links' onClick={closeMobileMenu} >
               Lake <i className="fas fa-caret-down" />
             </Link>
             {dropdownLake ?
              <ul onClick={handleClickDropdown} className={clickDropdown ? 'dropdown-menu clicked' : 'dropdown-menu'}>
              
                <li >
                  <Link className='dropdown-link' to='/ua06' onClick={() => setClickDropdown(false)} >
                    UA-06
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/ua08' onClick={() => setClickDropdown(false)} >
                    UA-08
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/ua07' onClick={() => setClickDropdown(false)} >
                    UA-07
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/ua01' onClick={() => setClickDropdown(false)} >
                    UA-01
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/nr02' onClick={() => setClickDropdown(false)} >
                    NR-02
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/oa04' onClick={() => setClickDropdown(false)} >
                    OA-04
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-link' to='/la03' onClick={() => setClickDropdown(false)} >
                    LA-03
                  </Link>
                </li>
              </ul>
                
              : ''}
           </li>

           
           <li className='nav-item'>
             <Link to='/upload-csv' className='nav-links' onClick={closeMobileMenu}>
               Upload CSV
             </Link>
           </li>
           
        </ul>

      </nav>

    </div>
  )
}

export default Navbar;