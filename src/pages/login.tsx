import {SetStateAction, useState} from "react";
import axios from 'axios'
import Header from "../components/Header.tsx";
import {Link} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";

const formStyle = {
    form: {
        maxWidth: "500px"
    },
    loginField: {
        height: "100vh",
        alignItems: "center"
    }
}


export default function Login() {
    const onSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await loginRequest();
    }
    let loggedIn = false;
    if(localStorage.getItem("authKey")!=null){
        loggedIn = true;
    }

    const loginSuccess = ()=>{
        return(
        <div className={" hero"}>
            <h1 className={"title is-1"}>Login Successful</h1>
            <button className = {"button is-success"} onClick={()=>{location.href = '/profile'}}>Profile</button>
            <button  className={"button is-danger mt-6"} onClick={logOut}>Logout</button>
        </div>
        )
    }

    const logOut = ()=>{
        localStorage.removeItem('authKey');
        loggedIn = false;
        location.reload();
    }
    const register = ()=>{
        window.location.href = '/register'
    }

    const notLoggedIn = ()=>{
        return(
            <div className={"hero"}>
                <h1 className={"title is-1"}>Login</h1>
                <form onSubmit={onSubmit}>
                    <div className={"field"}>
                        <input type="text" placeholder="Username" className={"input"} onChange={handleLoginChange} required />
                    </div>
                    <div className={"field"}>
                        <input type="password" placeholder="Password" className={"input"} onChange={handlePasswordChange} required />
                    </div>
                    <div className={"field is-flex is-justify-content-space-between"}>
                        <button className={"button is-primary"} type="submit">Login</button>
                    </div>
                    <p>Dont have an account? <a href={'/register'}>register</a></p>
                </form>
            </div>
        )
    }

    async function loginRequest() {
        try {
            const response = await axios.get('http://localhost:3000/auth',
                {
                    withCredentials:false,
                    headers:{
                        'login': inputLoginValue,
                        'password': inputPasswordValue,
                    }
                });
            if(response.status === 200){
                loggedIn = true;
                toast.success('Logged in successfully');
                localStorage.setItem('authKey', response.data.authKey);
                location.reload();
            }

        } catch (error) {
            toast.error('Error while logging in');
            console.log(error)
        }
    }

    const [inputLoginValue, setLoginValue] = useState('');
    const [inputPasswordValue, setPasswordValue] = useState('');
    const handleLoginChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setLoginValue(event.target.value);
    }
    const handlePasswordChange = (event: { target: { value: SetStateAction<string>; }; }) =>{
        setPasswordValue(event.target.value);
    }
    return(
        <>
            <Header></Header>
            <div className={"container is-flex is-justify-content-center is-align-content-center " +
                "is-fullheight is-vcentered"} style={formStyle.loginField}>

                {loggedIn?loginSuccess():notLoggedIn()}
            </div>

        </>
    )
}