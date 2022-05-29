import React from 'react';

/**
 * Component for data disclaimer text.
 * @returns {JSX.Element}
 */
function DataDisclaimer() {
    return (
        <div className='data-disclaimer'>
            <p className='disclaimer1'>Note: These data are provisional and not error checked!</p>
            <p className='disclaimer2'>These data were collected and are currently being processed and analyzed by 
                the UC Davis Tahoe Environmental Research Center (TERC). They are 
                considered preliminary. Do not use or distribute without written permission 
                from TERC.</p>
            <p className='disclaimer2'>For all questions please contact Dr. Shohei Watanabe (swatanabe@ucdavis.edu) 
                or Dr. Alicia Cortes (alicortes@ucdavis.edu)</p>
        </div>
    );
};

export default DataDisclaimer;