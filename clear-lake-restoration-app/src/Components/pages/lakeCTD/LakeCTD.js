import React, { useState } from 'react';
import Highcharts from 'highcharts';
import DataDisclaimer from '../../DataDisclaimer';

export default function LakeCTD(props) {
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
        },
        credits: {
            enabled: false,
        }
    })
    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer />
        </div>
        
    )
}