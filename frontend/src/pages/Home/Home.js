import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import Upload from "../../components/Post/Upload";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteIcon from '@material-ui/icons/Delete';
import "../Home/Home.css";
import Img from "../../img/icon.png";
import jwt_decode from "jwt-decode";

function Home() {
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [editPost, setEditPost] = useState("");
    const [updateComment, setUpdateComment] = useState(false);
    const [editComment, setEditComment] = useState("");
   // const category = {comments:[{userId:'Product1', postId:10, content:{comment.content}}, {userId:'Product2', postId:1, content:'blabla'}]};

    const token = localStorage.getItem("Token");
    const decoded = jwt_decode(token);
    const userId = decoded["userId"];

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
                       // setPosts(res.data);
                       window.location.reload();
                    })
                    .catch((error) => console.log(error));
                };

                const handleSubmitComment = (e) => {
                    e.preventDefault();
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
                        //setPosts(res.data);
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
                    //  setPosts(res.data);
                      setComments(res.data);
                     // window.location.reload();
                    })
                    .catch((error) => console.log(error));
                };
    
                const updatePost = () => {
                    const token = localStorage.getItem("Token");
                    if (editPost /*&& (post.userId === token.userId || isAdmin === true)*/) {
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
                           // setPosts(res.data);
                           // setEditPost(res.data);
                            window.location.reload();
                            setIsUpdated(false);
                        })
                        .catch((error) => console.log(error));
                    }
                };

                const deletePost = () => {
                    const token = localStorage.getItem("Token");
                    const isAdmin = localStorage.getItem("Token").isAdmin;
                    //if (post.userId === token.userId || isAdmin === true) {
                        axios({
                            method: "DELETE",
                            url: `http://localhost:3001/api/posts/${post.id}`,
                            headers: {
                                Authorization: `Bearer ${token}` ,
                            },
                        })
                        .then((res) => {
                            //setPosts(res.data);
                            window.location.reload();
                        })
                        .catch((error) => console.log(error));
                    //}
                };

                return (
                    <div className="post" key={post.id}>
                        <div className="post-content">
                            <div className="post-content-profil-img">
                                {post.User.imageURL === null ? (
                                    <img className="post-profil-img" src={Img} alt="Logo Groupomania" />
                                ) : (
                                    <img className="post-profil-img" src={post.User.imageURL} alt="Avatar" />
                                )}
                            </div>
                            <div className="post-content-header">
                                <Link to={`/profil/${post.User.id}`}>
                                    Posté par {post.User.pseudo} 
                                </Link>
                            </div> 
                            <div className="post-content-date">
                               le {new Date(post.createdAt).toLocaleDateString("fr-FR")}
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
                                        className="edit-input"
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
                            <p>Aimé par {post.like} personnes</p>
                            <CommentIcon 
                                id="comment-btn" 
                               onClick={getComments} 
                            />
                            {(post.userId === userId /*|| post.User.isAdmin*/) && (
                                <div className="updated-btn-container">
                                    <BorderColorIcon 
                                        id="modify-btn"
                                        onClick={() => setIsUpdated(!isUpdated)}
                                    />
                                    <DeleteIcon 
                                        id="delete-btn" 
                                        onClick={deletePost} 
                                    />
                                </div>
                            )}
                        </div>
                        <form className="comment-form" action="" onSubmit={handleSubmitComment}>
                            <input 
                                type="textarea" 
                                name="comment" 
                                id="comment" 
                                onChange={(e) => setComment(e.target.value)} 
                                value={comment}
                                placeholder="Say hello to..." 
                                className="send-comment"
                            />
                            <br />
                            <input type="submit" value="Publier" className="btn-comment" />
                        </form>
                        
                        <div className="comment-container">
                            {comments.map((comment) => { 

                                /**
                                * (Dépendant du .map comments)
                                * deleteComment pour la suppression d'un commentaire,
                                * modifyComment pour la modification d'un commentaire,
                                * (Tous rattachés au useEffect de getAllPosts).
                                */
                                const modifyComment = () => {
                                    const token = localStorage.getItem("Token");
                                    const isAdmin = localStorage.getItem("Token").isAdmin;
                                    if (editComment /*&& (comment.userId === token.userId || isAdmin === true)*/) {
                                        axios({
                                            method: "PUT",
                                            url: `http://localhost:3001/api/posts/${post.id}/comments/${comment.id}`,
                                            headers: {
                                                Authorization: `Bearer ${token}` ,
                                            },
                                            data: {
                                                content: editComment,
                                                postId: post.id,
                                                userId: token.userId,
                                            },
                                        })
                                        .then((res) => {
                                            // setPosts(res.data);
                                            // setEditComment(res.data);
                                            setUpdateComment(false);
                                            window.location.reload();
                                        })
                                        .catch((error) => console.log(error));
                                    }
                                };

                                const deleteComment = () => {
                                    const token = localStorage.getItem("Token");
                                    const isAdmin = localStorage.getItem("Token").isAdmin;
                                    // if (comment.userId === token.userId || isAdmin === true) {
                                    axios({
                                        method:"DELETE",
                                        url: `http://localhost:3001/api/posts/${post.id}/comments/${comment.id}`,
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    })
                                    .then((res) => {
                                        //setPosts(res.data);
                                        window.location.reload();
                                    })
                                    .catch((error) => console.log(error));
                                };
                                console.log(comments)
                                if (comment.postId === post.id) {
                                return (
                                    <div className="comments-container" key={comment.id}>
                                        <div className="post-comments">
                                            <div className="post-comment-profil-img">
                                                {comment.User.imageURL === null ? (
                                                    <img className="comment-profil-img" src={Img} alt="Logo Groupomania" />
                                                ) : (
                                                    <img className="comment-profil-img" src={comment.User.imageURL} alt="Avatar" />
                                                )}
                                            </div>
                                            <div className="post-comments-header">
                                                <Link to={`/profil/${comment.User.id}`}>
                                                    Posté par {comment.User.pseudo}
                                                </Link>
                                            </div>
                                            <div className="post-comments-date">
                                               le  {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                                            </div>
                                        </div>
                                        <div className="post-comments-content">
                                            {updateComment === false && <p>{comment.content}</p>}
                                            {updateComment && (
                                                <div className="comment-edit-content">
                                                    <input 
                                                        type="textarea" 
                                                        defaultValue={comment.content}
                                                        onChange={(e) => setEditComment(e.target.value)}
                                                    />
                                                    <br />
                                                    <button className="edit-btn" onClick={modifyComment}>
                                                        Valider la modification
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {(comment.userId === userId /*|| comment.User.isAdmin*/) && (
                                            <div className="post-comments-options">
                                                <BorderColorIcon 
                                                    id="modify-btn"
                                                    onClick={() => setUpdateComment(!updateComment)}
                                                />
                                                <DeleteIcon 
                                                    id="delete-btn" 
                                                    onClick={deleteComment} 
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                            })}
                        </div>
                    </div>
                )
            })}
        </section>
    );
};

export default Home;