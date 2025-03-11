import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {FormEvent, JSX, SetStateAction, useCallback, useEffect, useState} from "react";
import Header from "../components/Header.tsx";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface NewsPost {
    userAuth: string;
    title: string;
    content: string;
    userName: string;
    postTime: string;
    id:number
}

export default function Thread() {

    const [posts, setPosts] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const params = useParams();
    const [postTitle, setTitle] = useState('');
    const loggedIn = localStorage.getItem('authKey') != null;
    const [postContent, setContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const handlePostTitleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setTitle(e.target.value);
    }
    const handlePostContentChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setContent(e.target.value);
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await postRequest();
    }
    const markdownPreview = () => {
        if (!showPreview || !postContent) return null;

        return (
            <div className="box mt-3">
                <div className="is-flex is-justify-content-space-between mb-2">
                    <p className="subtitle is-6">Preview</p>
                    <button
                        className="button is-small"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPreview(false);
                        }}
                    >
                        Close Preview
                    </button>
                </div>
                <div className="content">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                    >{postContent}</ReactMarkdown>
                </div>
            </div>
        );
    };

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
                    threadId: params.id,
                    isMarkdown: true
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: false
                });
            console.log('post sent')
            toast.success('Post sent!')
            console.log(response)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setPosts([newPost, ...posts]);
            setTitle('');
            setContent('');
            fetchPosts();
        } catch (error) {
            toast.error('Error sending post!')
            console.error('Error creating post:', error);
        }
    }

    const fetchPosts = useCallback(() => {
        axios.get(`http://localhost:3000/posts/threads/${params.id}/posts`)
            .then(res => {
                // Ensure markdown content is properly preserved
                const formattedPosts = res.data.map((post: NewsPost) => ({
                    ...post,
                    content: post.content || '' // content is never null/undefined
                }));
                setPosts(formattedPosts);
            })
            .catch(err => {
                toast.error("Failed to fetch posts");
                console.error(err);
            });
    }, [params.id]);

    const deletePost = (id:number)=>{
        axios.delete(`http://localhost:3000/posts/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false
        })
           .then(() => {
                toast.success('Post deleted!')
                fetchPosts();
            })
           .catch((error) => {
                toast.error('Error deleting post!')
                console.error('Error deleting post:', error);
            });

    }
    const postForm = () => {
        return (
            <>
                <Header/>
                <div className={" box ml-6 mr-6 mt-6"}>
                    <p className={"subtitle ml-6 mr-6 mb-5"}>What's new?</p>
                    <form onSubmit={(e) => {
                        handleSubmit(e).then(() => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            document.getElementById('title').value = '';
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            document.getElementById('content').value = '';
                        })
                    }} className={"ml-6 mr-6"}>
                        <div className={"field"}>
                            <label className={"label"}>Title</label>
                            <div className={"control"}>
                                <input className={"input"} type="text" name="title" id="title" required
                                       onChange={handlePostTitleChange}/>
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className={"label"}>Content</label>
                            <div className={"control"}>
                                <textarea className={"textarea"} name="content" id="content" required
                                          onChange={handlePostContentChange}/>
                            </div>
                            <div className="field">
                                {!showPreview && (
                                    <button
                                        className="button is-small is-info is-light"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowPreview(true);
                                        }}
                                    >
                                        Preview Markdown
                                    </button>
                                )}
                                {markdownPreview()}
                            </div>
                            <p className="help">
                                Supports markdown: **bold**, *italic*, [links](url), # headings, - lists, ```code```. 
                                Press Enter twice for a new paragraph or add two spaces at the end of a line for a line break.
                            </p>
                        </div>
                        <div className={"field"}>
                            <button className={"button is-primary"} type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </>
        )
    }
    useEffect(() => {
        fetchPosts();
        setLoading(false);
    }, [fetchPosts]);

    return (
        <div>

            {!loggedIn ? (
                <div className={"notification is-warning ml-6 mr-6 is-flex is-justify-content-space-between"}>
                    <p>You are not logged in</p>
                    <Link to={'/login'}>log in</Link>
                </div>) : (
                postForm()
            )}
            {posts.length === 0 && <p className={"ml-6"}>Be the first to share your thoughts!</p>}
            {!isLoading && posts.map((post: NewsPost, index) => {
                return (
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
                                    <Link to={`/profile/${post.userAuth}`} className={"subtitle"}>{post.userName}</Link>
                                </div>
                                <div className={"level"}>
                                    <div>
                                        <div className={"content"}>
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                            >{post.content.replace('  ', '\n')}</ReactMarkdown>
                                        </div>
                                        <p className={"subtitle"}>{post.postTime}</p>
                                    </div>
                                    {(post.userAuth === localStorage.getItem('authKey') || localStorage.getItem("authKey")==='admin') &&
                                        <button className={"button is-danger"}
                                        onClick = {()=> deletePost(post.id)}
                                        >Delete post</button>}
                                </div>
                            </div>
                        </article>
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
                    </div>
                )
            })}
        </div>
    )

}