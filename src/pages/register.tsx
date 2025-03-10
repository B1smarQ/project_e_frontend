import {useState, FormEvent, ChangeEvent} from "react";
import axios from 'axios'
import {Link} from "react-router-dom";
import Header from "../components/Header.tsx";
import {toast} from "react-toastify";
export default function Register(){


    async function registerRequest() {
        console.log("registerRequest")
        if (passwordValue !== confirmPasswordValue) {
            toast.error('Passwords do not match.');
            return;
        }
        console.log("sending request")
        try {
            console.log("sending request with username: " + usernameValue + " and password: " + passwordValue)
            const response = await axios.post(
                'http://localhost:3001/register',

                {login: usernameValue, password: passwordValue},
                {headers: {'Content-Type': 'application/json'},
                    withCredentials:false
                }

            );
            if (response.status === 201) {
                toast.success("Registration successful!")
                localStorage.setItem('authKey', response.data.authKey);
                localStorage.setItem('userName', response.data.userName);
                window.location.href = '/login'
            }
            else if(response.status == 409){
                toast.error('User already exists!');
                console.log(response);
            }
            else {
                toast.error('Unknown error');
                console.log(response);
            }
            console.log(response);
        } catch (error) {
            if(error.status === 409){
                toast.error('Username already exists');
                console.log(error.response);
            }
            else {
                console.error(error);
                toast.error('Registration failed: ' + (error.response?.data?.message || 'Unknown error'));
            }
        }
    }
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await registerRequest();
    }

    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsernameValue(event.target.value);
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.target.value);
    }

    const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordValue(event.target.value);
    }

    return(
        <>
            <Header/>
            <div className={"hero container is-flex is-justify-content-center is-align-content-center is-vcentered is-fullheight"}>
                <form className="form" onSubmit={onSubmit}>
                    <input type="text" className={"input"} placeholder="Username" onChange={handleUsernameChange} />
                    <input type="password" className={"input"} placeholder="Password" onChange={handlePasswordChange} />
                    <input type="password" className={"input"} placeholder="Confirm Password" onChange={handleConfirmPasswordChange} />
                    <button type="submit" className={"button is-success"}>Register</button>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </>
    )
}