import {Link} from "react-router-dom";
import Header from "../components/Header.tsx";
import {useEffect, useState} from "react";
export default function Home(){
    const className = "tag ml-6 is-large mt-4";
    const [seen, setSeen] = useState(true);
    const profileLink = () =>{
        const loggedIn = localStorage.getItem("authKey")!=null;

        if(loggedIn){
            return <Link to = {`/profile/${localStorage.getItem('authKey')}`} className={className}> My Profile</Link>
        }
        return <Link to = {'/login'} className={className}> Login</Link>
    }
    useEffect(() => {
        setSeen(localStorage.getItem('seen') === 'true');
    }, []);
    return(
        <div >
            <div className = "container is-fullwidth">
                <Header></Header>
            </div>
            {!seen &&
                <div
                    className={"has-text-info mt-6 is-flex is-flex-direction-column is-align-content-center is-fullwidth is-justify-content-center is-center has-background "}>
                    <h1 className={" is-size-1-desktop is-size-2-mobile has-text-centered"}>Welcome to E</h1>
                    <p className={" is-size-4-desktop is-size-5-mobile has-text-centered"}>This website is under
                        development</p>
                    <button className="button" onClick={() => {localStorage.setItem("seen", "true"); setSeen(true)}}>Understood</button>
                </div>
            }


            <div className={"is-fullwidth mt-6 ml-6 mr-6 is-display-flex is-flex-direction-column "}>
                {profileLink()}
                <Link to={'/news'} className={className}> News</Link>
            </div>

        </div>
    )
}