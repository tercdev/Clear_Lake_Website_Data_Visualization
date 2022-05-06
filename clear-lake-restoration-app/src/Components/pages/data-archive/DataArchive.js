import React from 'react';
import MeterologyDataSection from './MeterologyDataSection';
import CTDData from './CTDData';
import TChainData from './TChainData';
import './DataArchive.css';
import StreamDataSection from './StreamDataSection';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import StreamData from './StreamData';
import MeterologyData from './MeterologyData';

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
                    <Tabs>
                        <TabList>
                            <Tab>Clean Data</Tab>
                            <Tab>Real Time Data</Tab>
                        </TabList>
                        <TabPanel>
                            <StreamData id="Clean" 
                                url="https://1j27qzg916.execute-api.us-west-2.amazonaws.com/default/clearlake-streamturb-api" 
                                variables={["Station_ID","DateTime_UTC","Turb","Temp"]}
                            />
                        </TabPanel>
                        <TabPanel>
                            <center>Real time data is limited to 180 days.</center>
                            <StreamData id="Real Time" 
                                url="https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks"
                                variables={["Creek","TmStamp","RecNum","Turb_BES","Turb_Mean","Turb_Median","Turb_Var","Turb_Min","Turb_Max","Turb_Temp"]}
                            />
                        </TabPanel>
                    </Tabs>
                    {/* <h1 className='title'>Stream Data</h1> */}
                    {/* <StreamDataSection/> */}
                </TabPanel>
                <TabPanel>
                    <Tabs>
                        <TabList>
                            <Tab>Clean Data</Tab>
                            <Tab>Real Time Data</Tab>
                        </TabList>
                        <TabPanel>
                            <MeterologyData id="Clean" url="https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met"/>
                        </TabPanel>
                        <TabPanel>
                            <center>Real time data is limited to 150 days.</center>
                            <MeterologyData id="Real Time" url="https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink"/>
                        </TabPanel>
                    </Tabs>
                    {/* <h1 className='title'>Meterology Data</h1> */}
                    {/* <MeterologyDataSection/> */}
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