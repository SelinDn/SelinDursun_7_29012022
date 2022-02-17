import axios from "axios";
import React, { useEffect, useState } from "react";
import Upload from "../../components/Post/Upload";

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
                    </div>
                )
            })}
        </section>
    );
};

export default Home;