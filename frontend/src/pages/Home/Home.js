import axios from "axios";
import React, { useEffect, useState } from "react";
import Upload from "../../components/Post/Upload";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import "../Home/Home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        const token = localStorage.getItem("Token")
        axios({
            method: "get",
            url: "http://localhost:3001/api/posts",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            setPosts(res.data);
        })
        .catch((error) => console.log(error));
    }, []);

    return (
        <section className="home-page">
            <Upload />
            <h1 className="home-title">Récentes publications</h1>
            {posts.map((post) => {

                const likePost = () => {
                    const token = localStorage.getItem("Token")
                    axios({
                        method: "post",
                        url: `http://localhost:3001/api/posts/${post.id}`,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        data: {
                            postId: post.id,
                            userId: token.userId,
                        },
                    })
                    .then((res) => {
                        setPosts(res.data);
                    })
                    .catch((error) => console.log(error));
                }

                return (
                    <div className="post" key={post.id}>
                        <div className="post-content">
                            <div className="post-content-header">
                                Posté par {post.userId} 
                            </div> 
                            <div className="post-content-date">
                                {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                            </div>
                        </div>
                        <div className="post-content-content">
                            {post.content}
                        </div>
                        <div className="post-img">
                            {post.attachment && <img src={post.attachment} alt="" />}
                        </div>
                        <div className="post-engagement">
                            <ThumbUpIcon 
                                id="like-btn" 
                                onClick={likePost} 
                            />
                            Aimé par {post.like} personnes
                        </div>
                    </div>
                )
            })}
        </section>
    );
};

export default Home;