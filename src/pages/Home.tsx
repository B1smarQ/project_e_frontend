import {Link} from "react-router-dom";
import Header from "../components/Header.tsx";
import News from "./News.tsx";

export default function Home(){
    let className = "tag ml-6 is-large mt-4";
    const profileLink = () =>{
        const loggedIn = localStorage.getItem("authKey")!=null;

        if(loggedIn){
            return <Link to = {'/profile'} className={className}> My Profile</Link>
        }
        return <Link to = {'/login'} className={className}> Login</Link>
    }
    return(
        <>
            <div className = "container is-fullwidth">
                <Header></Header>
            </div>

            <div className={"is-fullwidth mt-6 ml-6 mr-6 is-display-flex is-flex-direction-column "}>
                {profileLink()}
                <Link to = {'/news'} className={className}> News</Link>
            </div>

        </>
    )
}