import axios from "axios";
import {FormEvent, FormEventHandler, SetStateAction, useEffect, useState} from "react";
import Header from "../components/Header.tsx";
import {Link} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';


interface thread {
    id: number,
    threadTitle: string,
    threadAuthor: string
    messages: number
}

export default function News() {

    const [threads, setThreads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const loggedIn = localStorage.getItem('authKey') != null;
    const [title, setTitle] = useState('');
    const userName = localStorage.getItem('userName');

    const fetchThreads = async () => {
        try {
            const response = await axios.get('http://localhost:3000/posts/threads');
            setThreads(response.data);
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    }


    useEffect(() => {
        fetchThreads().then(() => setIsLoading(false));
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newThread = {
            title: e.target.threadTitle.value,
            author: localStorage.getItem('userName'),
        }
        try {
            await axios.post('http://localhost:3005/threads', newThread);
            toast.success("Thread created successfully");
            await fetchThreads();
        } catch (error) {
            console.error('Error creating thread:', error);
            toast.error("Error creating thread");
        }
    }

    const deleteThreadRequest = async (id:number) =>{
        try {
            await axios.delete(`http://localhost:3000/posts/threads/${id}`);
            toast.success("Thread deleted successfully");
            await fetchThreads();
        } catch (error) {
            console.error('Error deleting thread:', error);
            toast.error("Error deleting thread");
        }
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }


    const threadCreationForm = () => {
        return (
            <div className={"card ml-6 mr-6"}>
                <form onSubmit={handleSubmit}>
                    <div className={"field"}>
                        <label className={"label"}>Title</label>
                        <div className={"control"}>
                            <input className={"input"} type={"text"} name={"threadTitle"} required
                                   onChange={handleTitleChange}/>
                        </div>
                    </div>

                    <div className={"field"}>
                        <div className={"control"}>
                            <button className={"button is-primary"} type="submit">Create Thread</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <>
            <Header/>
            <div className={"is-display-grid"}>
                <h1 className={"title has-text-centered mt-6"}>Threads</h1>

                {loggedIn && threadCreationForm()}
                {isLoading && <p>Page is loading</p>}
                {!isLoading && (
                    <div>
                        {threads.map((thread: thread, index) => {
                            return (
                                <div key={index} className={"card ml-6 mr-6"}>
                                    <div className={"card-content"}>
                                        <div className={"media"}>
                                            <div className={"media-content"}>
                                                <div className={"is-display-flex is-justify-content-space-between"}>
                                                    <p className={"title is-4 "}>
                                                        <Link to={`/thread/${thread.id}`}>{thread.threadTitle}</Link>
                                                    </p>
                                                    {(userName === thread.threadAuthor || localStorage.getItem('authKey') === 'admin') &&
                                                        <button className={"button is-danger"}
                                                        onClick={async() =>{deleteThreadRequest(thread.id)}}
                                                        >Delete thread</button> }
                                                </div>
                                                <p className={"subtitle is-6"}>
                                                    By: {thread.threadAuthor}
                                                </p>
                                                <p className={"subtitle is-6"}>
                                                    Messages: {thread.messages}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}