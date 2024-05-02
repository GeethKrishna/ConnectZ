import React, { useEffect, useState } from "react";
import { getConnections } from "../../../api/FirestoreApi";
import "./index.scss";

export default function ConnectedUsers({ user, getCurrentUser, currentUser }) {
  //console.log(user);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    getConnections(currentUser.userId, user.id, setIsConnected);
  }, [currentUser.userId, user.id]);
  return (
    isConnected||user.id==currentUser.userId ? <></>
    :
    <div className="grid-child">
      <img src={user.imageLink} alt="profile picture" className="picture"/>
      <p className="name">{user.name}</p>
      <p className="headline">{user.headline}</p>
      <button className="btn" onClick={() => getCurrentUser(user.id)} >Follow</button>
    </div>
  );
}
