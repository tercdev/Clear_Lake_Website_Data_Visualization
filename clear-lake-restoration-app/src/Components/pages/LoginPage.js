import React, { useState } from 'react';
import Uploader from '../Uploader.js';
import LoginForm from '../LoginForm';
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
                    <p>Please sign in to upload.</p>
                    <p className='drop-disclaimer1'>For all questions, please contact Dr. Alicia Cortes (alicortes@ucdavis.edu)</p>
                </div>
                
            </div>
         
            {(user.email != "") 
                ? ( // when user successfully logs in
                    <div className='welcome'>
                        <h2>Welcome, <span>{user.name}</span></h2>
                        <Uploader />
                        <button onClick={Logout}>Logout</button>
                    </div>
                )
                :(<LoginForm Login={Login} error={error}/>)
            }
            
        
        </div>
    )
}