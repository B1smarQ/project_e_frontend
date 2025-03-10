import axios from "axios";
import {FormEvent, SetStateAction, useEffect, useState} from "react";
import Header from "../components/Header.tsx";
import {Link} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';

interface NewsPost {
    title: string;
    content: string;
    userName: string;
    postTime: string;
}

export default function News() {
    const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const loggedIn = localStorage.getItem('authKey') != null;
    const [postTitle, setTitle] = useState('');
    const [postContent, setContent] = useState('');
    const handlePostTitleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setTitle(e.target.value);
    }
    const handlePostContentChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setContent(e.target.value);
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await  postRequest();
    }


    const postRequest = async () => {
        console.log('submit')
        const newPost = {
            title: postTitle,
            content: postContent,
            userAuth: localStorage.getItem('authKey'),
        };
        try {
            console.log('sending post')
            const response = await axios.post('http://localhost:3005/', {
                title: newPost.title,
                content: newPost.content,
                userAuth: newPost.userAuth,
                userName: localStorage.getItem('userName'),
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials:false
                });
            console.log('post sent')
            toast.success('Post sent!')
            console.log(response)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setNewsPosts([newPost,...newsPosts]);
            setTitle('');
            setContent('');
            fetchData();
        } catch (error) {
            toast.error('Error sending post!')
            console.error('Error creating post:', error);
        }
    }
    const postForm = () =>{
        return(
            <div className={" box ml-6 mr-6"}>
                <p className={"subtitle ml-6 mr-6 mb-5"}>What's new?</p>
                <form onSubmit={(e)=> {handleSubmit(e).then(() => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    document.getElementById('title').value = '';
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    document.getElementById('content').value = '';
                })}} className={"ml-6 mr-6"}>
                    <div className={"field"}>
                        <label className={"label"}>Title</label>
                        <div className={"control"}>
                            <input className={"input"} type="text" name="title" id = "title"  required onChange={handlePostTitleChange}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Content</label>
                        <div className={"control"}>
                            <textarea className={"textarea"} name="content" id = "content" required onChange={handlePostContentChange}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <button className={"button is-primary"} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/posts');
            setNewsPosts(response.data);
            console.log('Data fetched');
            console.log(newsPosts)
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    useEffect(() => {
        fetchData().then(() => setIsLoading(false));
    }, []);

    return (
        <>
            <Header/>
            <div className={"is-display-grid"}>
                <h1 className={"title has-text-centered mt-6"}>Posts</h1>
                {!loggedIn ? (
                    <div className={"notification is-warning ml-6 mr-6 is-flex is-justify-content-space-between"}>
                        <p>You are not logged in</p>
                        <Link to={'/login'}>log in</Link>
                    </div>):(
                        postForm()
                )}

                {isLoading ? (
                    <p>Page is loading</p>
                ) : (
                    <div>
                        {newsPosts.map((post, index) => (
                            <div key={index} className={"box ml-6 mr-6 mb-6"}>
                                <article className={"media"}>
                                    <div className={"media-left"}>
                                        <span className={"image is-64x64"}>
                                            <img src={"https://avatar.iran.liara.run/public"} alt={post.title}/>
                                        </span>
                                    </div>
                                    <div className={"media-content"}>
                                        <div className={"level"}>
                                            <h1 className={"title"}>{post.title}</h1>
                                            <h2 className={"subtitle"}>{post.userName}</h2>
                                        </div>
                                        <p className={"subtitle"}>{post.content}</p>
                                        <p className={"subtitle"}>{post.postTime}</p>
                                    </div>
                                </article>
                            </div>
                        ))}
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