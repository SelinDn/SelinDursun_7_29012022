import axios from "axios";
import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import Img from "../../img/icon.png";

function Profil() {
    const {id} = useParams();
    const [file, setFile] = useState([]);
    const [user, setUser] = useState([]);
    const [isUpdated, setIsUpdated] =useState(false);
    const [yourPosts, setYourPosts] = useState([]);

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
    }, []);

    const updateUser = () => {
        const token = localStorage.getItem("Token");
        const isAdmin = localStorage.getItem("Token").isAdmin;
        const formData = new FormData();
        formData.append("file", file[0]);

        if (file && (user.id === token.userId || isAdmin === true)) {
            axios({
                method: "PUT",
                url: `http://localhost:3001/api/users/${id}`,
                headers: {
                    Authorization: `Bearer ${token}` ,
                },
                data: formData,
            })
            .then((res) => {
                setUser(res.data);
                setFile(res.data);
                setIsUpdated(false);
                window.location.reload();
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
            if (user.id === token.userId || isAdmin === true) {
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
            }
        }
        else {
            window.location.href=`/profil/${id}`;
        }
    };

    return (
        <div className="profil-container">
            <div className="profil-info-container">
                <h1 className="profil-title">Profil de {user.pseudo}</h1>
                {isUpdated === false && <div className="profil-avatar-container">
                    {user.imageURL === null ? (
                        <img className="profil-img" src={Img} alt="Logo Groupomania" /> 
                    ) : (
                        <img className="profil-img" src={user.imageURL} alt="avatar" /> 
                    )}
                </div> }
                {isUpdated && (
                    <div className="change-profil-img">
                        <input 
                            type="file" 
                            defaultValue={user.imageURL}
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <br />
                        <button className="edit-btn" onClick={updateUser}>
                            Valider la modification
                        </button>
                    </div>
                )}
                <div className="profil-options">
                    <button className="modify-profil-btn" onClick={() => setIsUpdated(!isUpdated)}>
                        Changer de photo de profil
                    </button>
                    <button className="delete-profil-btn" onClick={deleteProfile}>
                        Supprimer mon compte
                    </button>
                </div>
            </div>
            <h2 className="posts-user-title">Vos publications</h2>
            
        </div>
    );
};

export default Profil;