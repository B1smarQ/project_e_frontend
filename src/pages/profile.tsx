import Header from "../components/Header.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

interface NewsPost {
    title: string;
    content: string;
}

export default  function Profile(){
    const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
    const [userName, setUserName] = useState('')
    const [isLoading, setLoading] = useState(true);

    const fetchPosts = async() =>{
        try{
            console.log('Fetching posts')
            const response = await axios.get('http://localhost:3000/posts/userPosts',{
                headers: {Authorization: localStorage.getItem('authKey')}
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

    useEffect(() => {
        if(!userName)
            fetchData().then(() =>fetchPosts());
    }, []);

    return(
        <>
            <Header/>
            <div className={"box ml-6 mr-6 mt-6 is-half-desktop"}>
                <h1 className={"title"}>Profile</h1>
                {isLoading && <p>Loading...</p>}
                {!isLoading&& <h2 className={"subtitle"}>Welcome in, {userName}!</h2>}
            </div>
            <div className={"box ml-6 mr-6 mt-6 is-half-desktop"}>
                <h3 className={"subtitle"}> Here are your latest posts </h3>
            </div>
            <div>
                {newsPosts.map((post, index) => (
                    <div key={index} className={"box ml-6 mr-6 mt-6 is-half-desktop"}>
                        <h4 className={"title"}>{post.title}</h4>
                        <p className={"subtitle"}>{post.content}</p>
                        <p className={"mt-5"}> {post.postTime}</p>
                        <button className={"button is-danger mt-4"} data-atr={post.id} onClick={() =>{deletePost(post.id)}}>Delete post</button>
                    </div>
                ))}
            </div>
        </>
    )
}