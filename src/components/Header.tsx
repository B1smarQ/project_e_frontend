export default function Header(){
    const profileButton = ()=>{
        const loggedIn = localStorage.getItem('authKey') != null;
        return loggedIn? (
            <div className={"column is-flex is-justify-content-center"}>
                <h1 className={"subtitle"}>
                    <a href="/profile" className={"has-text-white"}>
                        Profile
                    </a>
                </h1>
            </div>
        ):
            (
                <div className={"column is-flex is-justify-content-center"}>
                    <h1 className={"subtitle"}>
                        <a href="/login" className={"has-text-white"}>
                            Log In
                        </a>
                    </h1>
                </div>
            )
    }

    return (
        <header className="is-fullwidth">
            <div className="container has-background-black-soft is-transparent">
                <div className="columns">
                    <div className="column is-flex is-justify-content-center">
                        <h1 className={"subtitle"}>
                        <a href="/" className={"has-text-white"}>
                                Home
                            </a>
                        </h1>
                    </div>
                    <div className={"column is-flex is-justify-content-center"}>
                        <h1 className={"title is-large"}>
                            E
                        </h1>
                    </div>
                    {profileButton()}
                </div>
            </div>
        </header>
    )
}