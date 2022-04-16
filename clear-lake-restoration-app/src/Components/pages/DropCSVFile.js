import React from 'react';
import Uploader from '../Uploader.js';


export default function DropCSVFile() {
    return (
        <div>
            <h1 className='drop-csv-header'>Upload a CSV File</h1>
            <Uploader />
        </div>
    )
}