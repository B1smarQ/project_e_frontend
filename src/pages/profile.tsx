import Header from "../components/Header.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {data, useParams} from "react-router-dom";

interface NewsPost {
    title: string;
    content: string;
}

export default  function Profile(){
    const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
    const [userName, setUserName] = useState('')
    const [isLoading, setLoading] = useState(true);
    const [isEditing, setEditing] = useState(false);
    const [editedPost, setEditedPost] = useState<NewsPost>(null);
    const [title,setTitle] = useState('');
    const [content, setContent] = useState('');
    const params = useParams();
    const isCurrentUser = params.id === localStorage.getItem('authKey');
    const fetchPosts = async() =>{
        try{
            console.log('Fetching posts')
            const response = await axios.get('http://localhost:3000/posts/userPosts',{
                headers: {Authorization: params.id}
            });
            setNewsPosts(response.data)
            console.log('Posts fetched', response.data)
            setLoading(false)
        }
        catch (error) {
            console.error(error);
        }
    }

    const fetchData = async() =>{
        try {
            console.log('Fetching data')
            const response = await axios.get('http://localhost:3000/auth/user',{
                params: {authKey: localStorage.getItem('authKey'),},
                headers: {'Authorization': `${localStorage.getItem('authKey')}`}
            });
            setUserName(response.data[0].login)
            console.log('Data fetched', response.data)
        }
        catch (error) {
            console.error(error);
        }
    }
    const editPostRequest = async (title: string, content: string, id: number) => {
        try {
            const response = await axios.put(`http://localhost:3005/post/${id}`,
                {
                    title:title,
                    content:content,
                    userAuth: localStorage.getItem('authKey'),
                }
                )
            if(response.status === 200){
                toast.success('Post successfully updated!')
                fetchData()
            }

        }
        catch (error) {
            console.error(error);
            toast.error('Error editing post!')
        }
        finally {
            setEditing(false)
        }
    }

    const deletePost = async(postId) =>{
        try {
            const response = await axios.delete(`http://localhost:3000/posts/delete/${postId}`,);
            toast.success("Post deleted");
            fetchPosts()
        }
        catch (error) {
            console.error(error);
        }
    }
    const logOut = () =>{
        localStorage.removeItem('authKey');
        localStorage.removeItem('userName');
        location.href="/login";
    }
    useEffect(() => {
        if(!userName)
            fetchData().then(() =>fetchPosts());
    }, []);

    const editForm = (post :NewsPost) =>{
        return(
            <div className={"box ml-6 mr-6"}>
                <form className={"ml-6 mr-6 "} onSubmit={(e) =>{
                    e.preventDefault();
                    if(title == post.title && content == post.content){
                        toast.info("No changes made");
                        return
                    }
                    editPostRequest(title, content, post.id);

                }}>
                    <div className={"field"}>
                        <label className={"label"}>Title</label>
                        <div className={"control"}>
                            <input type={"text"} className={"input"} name = "title" defaultValue={post.title} onChange = {(e)=>setTitle(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Content</label>
                        <div className={"control"}>
                            <input type={"text"} className={"input"} name={"content"} defaultValue={post.content} onChange = {(e)=>setContent(e.target.value)}/>
                        </div>
                    </div>
                    <button type="submit" className={"button is-success"}>Update Post</button>
                </form>
            </div>
        )
    }

    return(
        <>
            <Header/>
            <div className={"box ml-6 mr-6 mt-6 is-half-desktop"}>
                <h1 className={"title"}>Profile</h1>
                {isLoading && <p>Loading...</p>}
                {!isLoading&& <h2 className={"subtitle"}>Welcome in, {userName}!</h2>}
                <button className={"button is-clickable is-danger"} onClick={logOut}>Log out</button>
            </div>
            <div className={"box ml-6 mr-6 mt-6 is-half-desktop"}>
                <h3 className={"subtitle"}> Here are your latest posts </h3>
            </div>
            {isEditing && editForm(editedPost)}
            <div>
                {newsPosts.map((post, index) => (
                    <div key={index} className={"box ml-6 mr-6 mt-6 is-half-desktop"}>
                        <h4 className={"title"}>{post.title}</h4>
                        <p className={"subtitle"}>{post.content}</p>
                        <p className={"mt-5"}> {post.postTime}</p>
                        <div className={" "}>
                            {isCurrentUser&& <button className={"button is-danger mt-4"} data-atr={post.id} onClick={() =>{deletePost(post.id)}}>Delete post</button>}
                            {isCurrentUser&& <button className={"button is-info mt-4 ml-6" } onClick={()=>
                            {
                                setEditing(!isEditing);
                                setEditedPost(post);
                                setTitle(post.title);
                                setContent(post.content);
                            }}    >Edit post</button>}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}