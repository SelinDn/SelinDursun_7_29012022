import axios from "axios";
import React, { useEffect, useState } from "react";
import Upload from "../../components/Post/Upload";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteIcon from '@material-ui/icons/Delete';
import "../Home/Home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [editPost, setEditPost] = useState("");

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
                 * updatePost pour la modification d'un post et deletePost pour la suppression,
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

                const updatePost = () => {
                    const token = localStorage.getItem("Token");
                    const isAdmin = localStorage.getItem("Token").isAdmin;
                    if (editPost && (post.userId === token.userId || isAdmin === true)) {
                        axios({
                            method: "PUT",
                            url: `http://localhost:3001/api/posts/${post.id}`,
                            headers: {
                                Authorization: `Bearer ${token}` ,
                            },
                            data: {
                                content: editPost,
                                postId: post.id,
                                userId: token.userId,
                            },
                        })
                        .then((res) => {
                            setPosts(res.data);
                            setEditPost(res.data);
                            setIsUpdated(false);
                        })
                        .catch((error) => console.log(error));
                    }
                };

                const deletePost = () => {
                    const token = localStorage.getItem("Token");
                    const isAdmin = localStorage.getItem("Token").isAdmin;
                    if (post.userId === token.userId || isAdmin === true) {
                        axios({
                            method: "DELETE",
                            url: `http://localhost:3001/api/posts/${post.id}`,
                            headers: {
                                Authorization: `Bearer ${token}` ,
                            },
                        })
                        .then((res) => {
                            setPosts(res.data);
                        })
                        .catch((error) => console.log(error));
                    }
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
                        {isUpdated === false && <p>{post.content}</p>}
                            {isUpdated && (
                                <div className="post-edit-content">
                                    <input 
                                        type="textarea" 
                                        defaultValue={post.content}
                                        onChange={(e) => setEditPost(e.target.value)}
                                    />
                                    <br />
                                    <button className="edit-btn" onClick={updatePost}>
                                        Valider la modification
                                    </button>
                                </div>
                           )}
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
                            <BorderColorIcon 
                                id="modify-btn"
                                onClick={() => setIsUpdated(!isUpdated)}
                            />
                            <DeleteIcon 
                                id="delete-btn" 
                                onClick={deletePost} 
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

                            /**
                             * (Dépendant du .map comments)
                             * deleteComment pour la suppression d'un commentaire,
                             * updateComment (à venir ...)
                             * (Tous rattachés au useEffect de getAllPosts).
                             */
                            const deleteComment = () => {
                                const token = localStorage.getItem("Token");
                                const isAdmin = localStorage.getItem("Token").isAdmin;
                                if (comment.userId === token.userId || isAdmin === true) {
                                    axios({
                                        method:"DELETE",
                                        url: `http://localhost:3001/api/posts/${post.id}/comments/${comment.id}`,
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    })
                                    .then((res) => {
                                        setPosts(res.data);
                                    })
                                    .catch((error) => console.log(error));
                                }
                            };

                            return (
                                <div className="comments-container" key={comment.id}>
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
                                    <div className="post-comments-options">
                                        <DeleteIcon 
                                            id="delete-btn" 
                                            onClick={deleteComment} 
                                        />
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