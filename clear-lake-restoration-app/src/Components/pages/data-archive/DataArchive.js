import React from 'react';
import MeterologyDataSection from './MeterologyDataSection';
import CTDData from './CTDData';
import TChainData from './TChainData';
import './DataArchive.css';
import StreamDataSection from './StreamDataSection';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function DataArchive() {
    return(
        <>
           <div className='station-page-header'>
                <h1 className='station-page-title'>Data Archive</h1>
            </div>
            <div className='data-desc-container'>
                <p className='data-desc'>These data were collected and are currently being 
                    processed and analyzed by the UC Davis Tahoe Environmental 
                    Research Center (TERC). They are considered preliminary. 
                    Do not use or distribute without written permission from 
                    TERC.For all questions please contact Dr. Shohei Watanabe 
                    (swatanabe@ucdavis.edu) or Dr. Alicia Cortes (alicortes@ucdavis.edu)</p>
                
                    <p className='data-desc'>Learn about the Metadata <a href="https://clearlakerestoration.sf.ucdavis.edu/metadata">here</a>.</p>
                    
                    <p className='data-desc'>Select location, start and end dates, and desired variables. Click submit. 
                Wait for data to be fetched. Click on Download button to download the CSV.
                </p>
                
            </div>
            <Tabs>
                <TabList>
                    <Tab>Stream Data</Tab>
                    <Tab>Meterology Data</Tab>
                    <Tab>CTD Data</Tab>
                    <Tab>TChain Data</Tab>
                </TabList>
                <TabPanel>
                    {/* <h1 className='title'>Stream Data</h1> */}
                    <StreamDataSection/>
                </TabPanel>
                <TabPanel>
                    {/* <h1 className='title'>Meterology Data</h1> */}
                    <MeterologyDataSection/>
                </TabPanel>
                <TabPanel>
                    {/* <h1 className='title'>CTD Data</h1> */}
                    <CTDData/>
                </TabPanel>
                <TabPanel>
                    {/* <h1 className='title'>TChain Data</h1> */}
                    <TChainData/>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default DataArchive;