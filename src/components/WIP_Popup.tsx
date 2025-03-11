import {useEffect, useState} from "react";

export default function WIP_Popup() {
    const [seen,setSeen] = useState(false);
    useEffect(() => {
        
    }, []);
    
    return (
        <>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*@ts-expect-error*/}
            {(!seen || localStorage.getItem('seen')==false ||true) && <div className={"is-full-desktop is-flex is-align-content-center is-position-sticky is-fullheight is-flex-direction-column"}>

                <h1 className={"title"}>Welcome to the Work-In-Progress (WIP) Section!</h1>
                <p>This section is meant for developers to share their work in progress or ask questions. Please note that the content here may not be finalized and may be updated frequently.</p>
                <button onClick={() => {localStorage.setItem('seen', 'true'); setSeen(true)}}>Got it, I'll stay informed.</button>
            </div>}
        </>
)
}