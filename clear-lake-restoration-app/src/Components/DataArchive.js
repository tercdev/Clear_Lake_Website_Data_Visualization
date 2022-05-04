import React from 'react';
import MeterologyData from './MeterologyData';
import StreamData from './StreamData';
import CTDData from './CTDData';
import TChainData from './TChainData';
import './DataArchive.css';

function DataArchive() {
    return(
        <>
            <h1 className='stream-home'>Data Archive</h1>
            <p className='map-caption'>These data were collected and are currently being 
                processed and analyzed by the UC Davis Tahoe Environmental 
                Research Center (TERC). They are considered preliminary. 
                Do not use or distribute without written permission from 
                TERC.For all questions please contact Dr. Shohei Watanabe 
                (swatanabe@ucdavis.edu) or Dr. Alicia Cortes (alicortes@ucdavis.edu)</p>
            <p className='map-caption'>Select location, start and end dates, click submit. 
            Wait for data to be fetched. Click on Download button to download the CSV.
            </p>
            <div className='archive-container'>
                <div>
                    <h1 className='title'>Stream Data</h1>
                    <StreamData/>
                </div>
                <div>
                    <h1 className='title'>Meterology Data</h1>
                    <MeterologyData/>
                </div>
                <div>
                    <h1 className='title'>CTD Data</h1>
                    <CTDData/>
                </div>
                <div>
                    <h1 className='title'>TChain Data</h1>
                    <TChainData/>
                </div>
            </div>
        </>
    )
}

export default DataArchive;