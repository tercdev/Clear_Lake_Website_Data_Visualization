import React, { useState } from 'react';
import {Navbar, Nav, Container, NavDropdown, Button, Modal} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';

const Navigation = () => {
  const [showStream, setShowStream] = useState(false);
  const [showMet, setShowMet] = useState(false);
  const [showLake, setShowLake] = useState(false);
  const showStreamDropdown = (e)=>{
      setShowStream(!showStream);
  }
  const hideStreamDropdown = e => {
      setShowStream(false);
  }

  const showMetDropdown = (e)=>{
    setShowMet(!showMet);
  }
  const hideMetDropdown = e => {
    setShowMet(false);
  }

  const showLakeDropdown = (e)=>{
    setShowLake(!showLake);
  }
  const hideLakeDropdown = e => {
    setShowLake(false);
  }
  return (
    <>
    <Navbar collapseOnSelect expand='sm' variant='dark'>
      <Container className="wrapper">
        <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav>
            <Nav.Link href='/Clear_Lake_Website_Data_Visualization/'>Home</Nav.Link>
            <NavDropdown title="Stream" id="collasible-nav-dropdown" show={showStream} onMouseEnter={showStreamDropdown} onMouseLeave={hideStreamDropdown}>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/stream">Overview</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/kelsey">Kelsey</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/middle">Middle</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/scotts">Scotts</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Meterology" id="collasible-nav-dropdown" show={showMet} onMouseEnter={showMetDropdown} onMouseLeave={hideMetDropdown}>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/met">Overview</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/nic">Nice</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/nlp">North Lakeport</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/bvr">Big Valley Rancheria</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/bkp">Buckingham Point</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/knb">Konocti Bay</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/clo">Clearlake Oaks</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/jbg">Jago Bay</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Lake" id="collasible-nav-dropdown" show={showLake} onMouseEnter={showLakeDropdown} onMouseLeave={hideLakeDropdown}>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/lake">Overview</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua06">UA-06</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua08">UA-08</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua07">UA-07</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/ua01">UA-01</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/nr02">NR-02</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/oa04">OA-04</NavDropdown.Item>
              <NavDropdown.Item href="/Clear_Lake_Website_Data_Visualization/la03">LA-03</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href='https://tahoe.ucdavis.edu/clear-lake-wind-maps'>Wind Animations</Nav.Link>
            <Nav.Link href='https://clearlakerestoration.sf.ucdavis.edu/'>To SiteFarm</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
    
  )
}

export default Navigation;