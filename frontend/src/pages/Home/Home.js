import axios from "axios";
import React, { useEffect, useState } from "react";
import Upload from "../../components/Post/Upload";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import "../Home/Home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    
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

                /**
                 * Logique likePost,
                 * handleSubmitComment pour création de commentaires,
                 * getComments pour récupération de tout les commentaires,
                 * (Tous rattachés au useEffect de getAllPosts).
                 */
                const likePost = () => {
                    const token = localStorage.getItem("Token");
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
                        window.location.reload();
                    })
                    .catch((error) => console.log(error));
                };

                const handleSubmitComment = () => {
                    const token = localStorage.getItem("Token");
                    axios({
                        method: "post",
                        url: `http://localhost:3001/api/posts/${post.id}/comments`,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        data: {
                            content: comment,
                            postId: post.id,
                            userId: token.userId,
                        },
                    })
                    .then((res) => {
                        setPosts(res.data);
                        window.location.reload();
                    })
                    .catch((error) => console.log(error));
                };

                const getComments = () => {
                    const token = localStorage.getItem("Token");
                    axios({
                        method: "get",
                        url: `http://localhost:3001/api/posts/${post.id}/comments`,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        setPosts(res.data);
                        setComments(res.data);
                    })
                    .catch((error) => console.log(error));
                };

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
                            Aimé par {post.like.length} personnes
                            <CommentIcon 
                                id="comment-btn" 
                                onClick={getComments} 
                            />
                        </div>
                        <form className="comment-form" action="" onSubmit={handleSubmitComment}>
                            <input 
                                type="textarea" 
                                name="comment" 
                                id="comment" 
                                onChange={(e) => setComment(e.target.value)} 
                                value={comment}
                                placeholder="Say hello to..." 
                            />
                            <br />
                            <input type="submit" value="Publier" className="btn-comment" />
                        </form>
                        {comments.map((comment) => {
                            return (
                                <div className="comments-container" key={post.id}>
                                    <div className="post-comments">
                                        <div className="post-comments-header">
                                            Posté par {comment.userId}
                                        </div>
                                        <div className="post-comments-date">
                                            {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                                        </div>
                                    </div>
                                    <div className="post-comments-content">
                                        {comment.content}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </section>
    );
};

export default Home;