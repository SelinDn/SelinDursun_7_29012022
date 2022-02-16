import axios from "axios";
import React, { useState } from "react";
import "../Post/Upload.css";

/**
 * Création du component Upload pour création d'un post,
 * Stockage avec les hooks (useState),
 * Logique (handleSubmit),
 * Requête avec axios à la db,
 * Puis affichage en jsx.
 */

function Upload() {
    const [content, setContent] = useState("");
    const [file, setFile] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("Token");

        const formData = new FormData();
        formData.append("file", file[0]);
        formData.append("content", content);
        formData.append("userId", token.userId);

        axios({
            method: "post",
            url: "http://localhost:3001/api/posts",
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            data: formData,
        })
        .then((res) => {
            window.location = "/home";
        })
        .catch((error) => console.log(error));
    }

    return (
        <div className="upload">
            <div className="upload-form-container">
                <h1 className="upload-form-title">Créez votre post</h1>
                <form className="upload-form" action="" onSubmit={handleSubmit} id="upload-form">
                    <input 
                        type="textarea" 
                        name="content" 
                        id="content" 
                        onChange={(e) => setContent(e.target.value)} 
                        value={content} 
                        placeholder="What's in your mind ?" 
                        required 
                        className="form-input-content"
                    />
                    <br />
                    <input 
                        type="file" 
                        name="file" 
                        id="file" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        accept="image/*" 
                        className="form-input-file"
                    /> 
                    <br />
                    <input type="submit" value="Publier" className="btn-upload" />
                </form>
            </div>
        </div>
    );
};

export default Upload;