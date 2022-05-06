import React from 'react';
import MeterologyDataSection from './MeterologyDataSection';
import CTDData from './CTDData';
import TChainData from './TChainData';
import './DataArchive.css';
import StreamDataSection from './StreamDataSection';

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
            <div className='archive-container'>
                <div>
                    <h1 className='title'>Stream Data</h1>
                    <StreamDataSection/>
                </div>
                <div>
                    <h1 className='title'>Meterology Data</h1>
                    <MeterologyDataSection/>
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