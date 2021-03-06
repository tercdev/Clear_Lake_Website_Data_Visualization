import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import TChainData from './TChainData';
import CTDData from './CTDData';
import StreamData from './StreamData';
import MeteorologyData from './MeteorologyData';
import CollapsibleItem from '../../CollapsibleItem';

import './DataArchive.css';

/**
 * Component for showing the Data Archive page.
 * @returns {JSX.Element}
 */
function DataArchive() {

    // for the collapsible FAQ
    const content = [
        {   
            id: "1",
            header: "How to download data?",
            content: <ol>
                <li>Select location, start date, end date, and desired variables. Downloaded CSV is in local time UTC.</li>
                <li>Click submit.</li>
                <li>Wait for data to be fetched.</li>
                <li>Buttons will then appear, allowing data downloads to your computer. Metadata README files are also available for further explanation on data variables.</li>
            </ol>
        }, {
            id: "2",
            header: "What is the difference between clean and real-time data?",
            content: <p>Clean data has been reviewed by the TERC team. Real-time data is information that is delivered immediately after the data collection process. 
            There may be spikes or inconsistent data, as real-time data has not been reviewed by the TERC team. For more information regarding data, please visit the <a href="https://clearlakerehabilitation.ucdavis.edu/metadata">Metadata Explanation page</a>.</p>
        }
    ];

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
                <CollapsibleItem header={content[0].header} content={content[0].content}/>
                <CollapsibleItem header={content[1].header} content={content[1].content}/>
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
                            <Tab>Real-Time Data</Tab>
                        </TabList>
                        <TabPanel>
                            <StreamData id="Clean" 
                                url="https://5fw1h3peqb.execute-api.us-west-2.amazonaws.com/v1/clearlake-streamturb-api" 
                                variables={["Station_ID","DateTime_UTC","Turb","Temp"]}
                            />
                        </TabPanel>
                        <TabPanel>
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
                            <MeteorologyData id="Clean" 
                                url="https://5fw1h3peqb.execute-api.us-west-2.amazonaws.com/v1/clearlake-met"
                                variables={["Station_ID","DateTime_UTC","Air_Temp","Rel_Humidity","Wind_Speed","Wind_Dir","Atm_Pres","Rain","Solar_Rad"]}/>
                        </TabPanel>
                        <TabPanel>
                            <MeteorologyData id="Real Time" 
                                url="https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink"
                                variables={["Station_ID","DateTime_UTC","Air_Temp","Hi_Air_Temp","Low_Air_Temp","Rel_Humidity","Dew_Point","Wind_Speed","Wind_Dir","Hi_Wind_Speed","Hi_Wind_Speed_Dir","Atm_Pres","Rain","Rain_Rate","Solar_Rad","Solar_Energy"]}/>
                        </TabPanel>
                    </Tabs>
                </TabPanel>
                <TabPanel>
                    <CTDData/>
                </TabPanel>
                <TabPanel>
                    <TChainData/>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default DataArchive;