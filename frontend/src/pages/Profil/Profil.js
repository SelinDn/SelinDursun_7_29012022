import axios from "axios";
import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import Img from "../../img/icon.png";
import {Link} from "react-router-dom";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteIcon from '@material-ui/icons/Delete';
import "../Profil/Profil.css";
import jwt_decode from "jwt-decode";

function Profil() {
    const {id} = useParams();
    const [file, setFile] = useState("");
    const [user, setUser] = useState([]);
    const [isUpdated, setIsUpdated] =useState(false);
    const [yourPosts, setYourPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [editPost, setEditPost] = useState("");
    const [isUpdatedPost, setIsUpdatedPost] = useState(false);
    const [updateComment, setUpdateComment] = useState(false);
    const [editComment, setEditComment] = useState("");
    const [comments, setComments] = useState([]);

    const token = localStorage.getItem("Token");
    const decoded = jwt_decode(token);
    const userId = decoded["userId"];

    /**
    * useEffect pour getOneUser,
    * updateUser pour la modification de ses infos,
    * deleteProfile pour la suppression du compte.
    */
    useEffect(() => {
        const token = localStorage.getItem("Token")
        axios({
            method: "GET",
            url: `http://localhost:3001/api/users/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            setUser(res.data);
        })
        .catch((error) => console.log(error));
    }, [id]);

    const updateUser = () => {
        const token = localStorage.getItem("Token");
        const isAdmin = localStorage.getItem("Token").isAdmin;
        const formData = new FormData();
        formData.append("image", file);

        if (file /*&& (user.id === token.userId || isAdmin === true)*/) {
            axios({
                method: "PUT",
                url: `http://localhost:3001/api/users/${id}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}` ,
                },
                data: formData,
            })
            .then((res) => {
                setUser(res.data);
                setFile(res.data);
                setIsUpdated(false);
              //  window.location.reload();
            })
            .catch((error) => console.log(error));
        }
    };

    const deleteProfile = () => {
        if (
            window.confirm("Votre compte va être définitivement supprimé. Êtes-vous sûr de vouloir cela ? ")
        ) {
            const token = localStorage.getItem("Token");
            const isAdmin = localStorage.getItem("Token").isAdmin;
           // if (user.id === token.userId || isAdmin === true) {
                axios({
                    method: "DELETE",
                    url: `http://localhost:3001/api/users/${id}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    localStorage.clear();
                    window.location.href="/";
                })
                .catch((error) => console.log(error));
           // }
        }
        else {
            window.location.href=`/profil/${id}`;
        }
    };

    //useEffect pour getPostsByUser
    useEffect(() => {
        const token = localStorage.getItem("Token")
        axios({
            method: "GET",
            url: `http://localhost:3001/api/posts/users/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            setYourPosts(res.data);
        })
        .catch((error) => console.log(error));
    }, [id]);

    // Contient toutes les informations du User
    return (
        <div className="profil-container">
            <div className="profil-info-container">
                <h1 className="profil-title">Profil de {user.pseudo}</h1>
                {isUpdated === false && <div className="profil-avatar-container">
                    {user.imageURL === null || undefined ? (
                        <img className="profil-img" src={Img} alt="Logo Groupomania" />  
                    ) : (
                        <img className="profil-img" src={user.imageURL} alt="avatar" /> 
                    )}
                </div> }
                {isUpdated && (
                    <div className="change-profil-img">
                        <input 
                            type="file" 
                           /* defaultValue={user.imageURL}*/
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <br />
                        <button className="edit-btn" onClick={updateUser}>
                            Valider la modification
                        </button>
                    </div>
                )}
                {(user.id === userId /*|| post.User.isAdmin*/) && (
                    <div className="profil-options">
                        <button className="modify-profil-btn" onClick={() => setIsUpdated(!isUpdated)}>
                            Changer de photo de profil
                        </button>
                        <button className="delete-profil-btn" onClick={deleteProfile}>
                            Supprimer mon compte
                        </button>
                    </div>
                )}
            </div>
            <h2 className="posts-user-title">Vos publications</h2>
            {yourPosts.map((post) => {

                /**
                * Logique likePost,
                * handleSubmitComment pour création de commentaires,
                * getComments pour récupération de tout les commentaires,
                * updatePost pour la modification d'un post et deletePost pour la suppression,
                * (Tous rattachés au useEffect de getPostsByUser).
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
                        setYourPosts(res.data);
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
                        setYourPosts(res.data);
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
                        setYourPosts(res.data);
                        setComments(res.data);
                    })
                    .catch((error) => console.log(error));
                };

                const updatePost = () => {
                    const token = localStorage.getItem("Token");
                    const isAdmin = localStorage.getItem("Token").isAdmin;
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
                           // setYourPosts(res.data);
                           // setEditPost(res.data);
                            setIsUpdatedPost(false);
                            window.location.reload();
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
                            //setYourPosts(res.data);
                            window.location.reload();
                        })
                        .catch((error) => console.log(error));
                   // }
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
                            {isUpdatedPost === false && <p>{post.content}</p>}
                            {isUpdatedPost && (
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
                            Aimé par {post.like} personnes
                            <CommentIcon 
                                id="comment-btn" 
                                onClick={getComments} 
                            />
                            {(post.userId === userId /*|| post.User.isAdmin*/) && (
                                <div className="updated-btn-container">
                                    <BorderColorIcon 
                                        id="modify-btn"
                                        onClick={() => setIsUpdatedPost(!isUpdatedPost)}
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
                            />
                            <br />
                            <input type="submit" value="Publier" className="btn-comment" />
                        </form>
                        {comments.map((comment) => {
    
                            /**
                            * (Dépendant du .map comments)
                            * deleteComment pour la suppression d'un commentaire,
                            * modifyComment pour la modification d'un commentaire,
                            * (Tous rattachés au useEffect de getPostsByUser).
                            */
                            const modifyComment = () => {
                                const token = localStorage.getItem("Token");
                                const isAdmin = localStorage.getItem("Token").isAdmin;
                                if (editComment && (comment.userId === token.userId || isAdmin === true)) {
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
                                        setYourPosts(res.data);
                                        setEditComment(res.data);
                                        setUpdateComment(false);
                                    })
                                    .catch((error) => console.log(error));
                                }
                            };
    
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
                                        setYourPosts(res.data);
                                    })
                                    .catch((error) => console.log(error));
                                }
                            };
    
                            return (
                                <div className="comments-container" key={comment.id}>
                                    <div className="post-comments">
                                        <div className="post-content-profil-img">
                                            {comment.User.imageURL === null ? (
                                                <img className="post-profil-img" src={Img} alt="Logo Groupomania" />
                                            ) : (
                                                <img className="post-profil-img" src={comment.User.imageURL} alt="Avatar" />
                                            )}
                                        </div>
                                        <div className="post-comments-header">
                                            <Link to={`/profil/${comment.User.id}`}>
                                                Posté par {comment.userId}
                                            </Link>
                                        </div>
                                        <div className="post-comments-date">
                                            {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
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
                                    {(comment.userId === comment.User.id || comment.User.isAdmin) && (
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
                        })}
                    </div>
                )
            })}
        </div>
    );
};

export default Profil;