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
        if (details.email === adminUser.email && details.password === adminUser.password) {
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
         
            {(user.email !== "") 
                ? ( // when user successfully logs in
                    <div className='welcome-container'>
                        <h2 className="welcome-header">Welcome, <span>{user.name}</span>!</h2> 
                        <div className="reminder-container">
                            <h2 className="reminder-header">Naming Convention for file uploads</h2>
                            <p className="file-type">Meterology Files:</p>
                            <ul>
                                <li>met_bkp_FROMdate_TOdate.csv</li>
                                <li>met_bvr_FROMdate_TOdate.csv</li>
                                <li>met_clo_FROMdate_TOdate.csv</li>
                                <li>met_jgb_FROMdate_TOdate.csv</li>
                                <li>met_knb_FROMdate_TOdate.csv</li>
                                <li>met_nic_FROMdate_TOdate.csv</li>
                                <li>met_nlp_FROMdate_TOdate.csv</li>
                            </ul>
                            <p className="file-type">Stream Files:</p>
                            <ul>
                                <li>stream_kck_turb_FROMdate_TOdate.csv</li>
                                <li>stream_mcu_turb_FROMdate_TOdate.csv</li>
                                <li>stream_scs_turb_FROMdate_TOdate.csv</li>
                                <li>Flow and Rain data will automatically be scraped and added into its corresponding table (no file upload needed)</li>
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
                                    <li>ClearLake_NR02oxygen_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_OA04oxygen_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_UA01oxygen_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_UA06oxygen_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_UA08oxygen_FROMdate_TOdate.csv</li>
                                </ul>
                                <li>Lake Mooring (TChain) Temperature</li>
                                <ul>
                                    <li>ClearLake_LA03temperature_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_NR02temperature_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_OA04temperature_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_UA01temperature_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_UA06temperature_FROMdate_TOdate.csv</li>
                                    <li>ClearLake_UA08temperature_FROMdate_TOdate.csv</li>
                                </ul>
                            </ul>
                        </div>

                        <div className="reminder-container">
                            <h2 className="reminder-header">Other reminders</h2>
                            <ul>
                                <li>Dropzone only accepts up to 5 CSV files at a time</li>
                                <li>Files must be in .csv format</li>
                                {/* <li>If you are uploading files with same name with same FROMdate and same TOdate (but the data contents changed), 
                                    please add extra unique characters at the end of file name. (Example: add _0, _1, _2 ... at end of filename)</li>
                                <li>Why do this? The uploaded filenames must be unique to be inserted into database</li> */}
                                <li>Once uploaded file, please verify database table on changes</li>
                                <li>FROMdate and TOdate format: YearMonthDate (eg. 20220314)</li>
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