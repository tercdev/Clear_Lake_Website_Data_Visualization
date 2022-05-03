import React, { useState } from 'react';
import Uploader from './Uploader.js';
import LoginForm from './LoginForm';
import './LoginPage.css';


export default function LoginPage() {
    const adminUser = {
        email: "admin@admin.com",
        password: "admin123"
    }

    const [user, setUser] = useState({name: "", email: ""});

    // set message to display when error logging in
    const [error, setError] = useState("")

    const Login = details => {
        console.log(details);
        if (details.email == adminUser.email && details.password == adminUser.password) {
            console.log("logged in");
            setUser ({
                name: details.name,
                email: details.email
            });
        } else {
            console.log("details not match");
            setError("Invalid login!");
        }
    }

    const Logout = () => {
        console.log("log out");
        setUser ({
            name: "",
            email: ""
        });
    }

    return (
        <div>
            <div className='drop-csv-header'>
                <h1 className='drop-title'>Upload CSV</h1>
                <div className='drop-disclaimer'>
                    <p>*Admin Use Only</p>
                    <p className='drop-disclaimer1'>For all questions, please contact Dr. Alicia Cortes (alicortes@ucdavis.edu)</p>
                </div>
            </div>
         
            {(user.email != "") 
                ? ( // when user successfully logs in
                    <div className='welcome-container'>
                        <h2 className="welcome-header">Welcome, <span>{user.name}</span>!</h2> 
                        <div className="remainder-container">
                            <h2 className="remainder-header">Naming Convention for file uploads</h2>
                            <p className="file-type">Meterology Files:</p>
                            <ul>
                                <li>met_bkp_FROMdate_TOdate.csv</li>
                            </ul>
                            <p className="file-type">Stream Files:</p>
                            <ul>
                                <li>stream_kelsey_FROMdate_TOdate.csv</li>
                            </ul>
                            <p className="file-type">Lake Files:</p>
                            <ul>
                                <li>Profile Data (CTD)</li>
                                <ul>
                                    <li>ClearLake_ProfileData_FROMdate_TOdate.csv</li>
                                </ul>
                                <li>Lake Mooring (TChain) Oxygen</li>
                                <ul>
                                    <li>ClearLake_LA03oxygen_FROMdate_TOdate.csv</li>
                                </ul>
                                <li>Lake Mooring (TChain) Temperature</li>
                                <ul>
                                    <li>ClearLake_LA03temperature_FROMdate_TOdate.csv</li>
                                </ul>
                            </ul>
                        </div>

                        <div className="remainder-container">
                            <h2 className="remainder-header">Other remainders</h2>
                            <ul>
                                <li>Dropzone only accepts up to 5 CSV files</li>
                                <li>Files must be in .csv format</li>
                                <li>If you are uploading files with same name with same FROMdate and same TOdate (but the data contents changed), 
                                    please add extra unique characters at the end of file name. (Example: add _0, _1, _2 ... at end of filename)</li>
                                <li>Why do this? The uploaded filenames must be unique to be inserted into database</li>
                                <li>Once uploaded file, please verify database table on changes</li>
                            </ul>
                        </div>.
                        
                        <Uploader />
                        <div className="logout-btn-container">
                            <button className="logout-btn" onClick={Logout}>Logout</button>
                        </div>
                        
                    </div>
                )
                :(<LoginForm Login={Login} error={error}/>)
            }
            
        
        </div>
    )
}