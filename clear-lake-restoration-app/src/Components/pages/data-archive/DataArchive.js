import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import TChainData from './TChainData';
import CTDData from './CTDData';
import StreamData from './StreamData';
import MeterologyData from './MeterologyData';
import CollapsibleItem from '../../CollapsibleItem';

import './DataArchive.css';

function DataArchive() {

    // for the collapsible FAQ
    const header1 = "How to download data?";
    const content1 = [<ol>
            <li>Select location, start date, end date, and desired variables.</li>
            <li>Click submit.</li>
            <li>Wait for data to be fetched.</li>
            <li>Buttons will then appear, allowing data downloads to your computer. Metadata README files are also available for further explanation on data variables.</li>
        </ol>];

    const header2 = "What is the difference between clean and real-time data?";
    const content2 = [<p>Clean data has been reviewed by the TERC team. Real-time data is information that is delivered immediately after the data collection process. 
            There may be spikes or inconsistent data, as real-time data has not been reviewed by the TERC team. For more information regarding data, please visit the <a href="https://clearlakerestoration.sf.ucdavis.edu/metadata">Metadata Explanation page</a>.</p>];

    return(
        <>
           <div className='station-page-header'>
                <h1 className='station-page-title'>Data Archive</h1>
            </div>

            <div className='data-disclaimer'>
                <p className='disclaimer2'>These data were collected and are currently being processed and analyzed by 
                    the UC Davis Tahoe Environmental Research Center (TERC). They are 
                    considered preliminary. Do not use or distribute without written permission 
                    from TERC.</p>
                <p className='disclaimer2'>For all questions please contact Dr. Shohei Watanabe (swatanabe@ucdavis.edu) 
                    or Dr. Alicia Cortes (alicortes@ucdavis.edu)</p>
            </div>
            <div className="collapsible-container">
                <CollapsibleItem header={header1} content={content1}/>
                <CollapsibleItem header={header2} content={content2}/>
            </div>
         
            <Tabs className="outer-tab-container">
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
                        <center>Maximum 365 days at a time.</center>
                            <StreamData id="Clean" 
                                url="https://1j27qzg916.execute-api.us-west-2.amazonaws.com/default/clearlake-streamturb-api" 
                                variables={["Station_ID","DateTime_UTC","Turb","Temp"]}
                            />
                        </TabPanel>
                        <TabPanel>
                            <center>Maximum 180 days at a time.</center>
                            <StreamData id="Real Time" 
                                url="https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks"
                                variables={["Creek","TmStamp","RecNum","Turb_BES","Turb_Mean","Turb_Median","Turb_Var","Turb_Min","Turb_Max","Turb_Temp"]}
                            />
                        </TabPanel>
                    </Tabs>
                </TabPanel>
                <TabPanel>
                    <Tabs>
                        <TabList>
                            <Tab>Clean Data</Tab>
                            <Tab>Real Time Data</Tab>
                        </TabList>
                        <TabPanel>
                            <center>Maximum 365 days at a time.</center>
                            <MeterologyData id="Clean" 
                                url="https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met"
                                variables={["Station_ID","DateTime_UTC","Air_Temp","Rel_Humidity","Wind_Speed","Wind_Dir","Atm_Pres","Rain","Solar_Rad"]}/>
                        </TabPanel>
                        <TabPanel>
                            <center>Maximum 150 days at a time.</center>
                            <MeterologyData id="Real Time" 
                                url="https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink"
                                variables={["Station_ID","DateTime_UTC","Air_Temp","Hi_Air_Temp","Low_Air_Temp","Rel_Humidity","Dew_Point","Wind_Speed","Wind_Dir","Hi_Wind_Speed","Hi_Wind_Speed_Dir","Atm_Pres","Rain","Rain_Rate","Solar_Rad","Solar_Energy"]}/>
                        </TabPanel>
                    </Tabs>
                </TabPanel>
                <TabPanel>
                    <CTDData/>
                </TabPanel>
                <TabPanel>
                    <center>Maximum 365 days at a time.</center>
                    <TChainData/>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default DataArchive;