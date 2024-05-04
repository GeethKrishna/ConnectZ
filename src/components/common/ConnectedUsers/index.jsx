import React, { useEffect, useState } from "react";
import { getConnections } from "../../../api/FirestoreApi";
import "./index.scss";
import { useNavigate } from "react-router-dom";

export default function ConnectedUsers({ user, getCurrentUser, currentUser }) {
  //console.log(user);
  const [isConnected, setIsConnected] = useState(false);

  let navigate = useNavigate();

  const openUser = (user) => {
    navigate('/profile/', { state: { id: user.id, email: user.email }, });
  };

  useEffect(() => {
    getConnections(currentUser.userId, user.id, setIsConnected);
  }, [currentUser.userId, user.id]);
  return (
    isConnected||user.id==currentUser.userId ? <></>
    :
    <div className="grid-child">
      <img src={user.imageLink} alt="profile picture" className="picture" onClick={() => openUser(user)}/>
      <p className="name">{user.name}</p>
      <p className="headline">{user.headline}</p>
      <button className="btn" onClick={() => getCurrentUser(user.id)} >Follow</button>
    </div>
  );
}
