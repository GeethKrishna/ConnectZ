import React, { useEffect, useState } from 'react';
import { getAllUsers, addConnection } from "../api/FirestoreApi";
import "../Sass/ConnectionsComponent.scss";
import ConnectedUsers from './common/ConnectedUsers';

export default function ConnectionsComponent({ currentUser }) {

  const [users, setUsers] = useState([]);

  const getCurrentUser = (id) => {
    addConnection(currentUser.userId,id);
    //console.log(currentUser);
  };

  useEffect(() => {
    getAllUsers(setUsers);
  }, []);


  return (
    <div className='connections-main'>
        {users.map((user) => {
          return ( 
            <ConnectedUsers key={user.id} user={user} getCurrentUser={getCurrentUser} currentUser={currentUser} />
          );
        })}
    </div>
  );
}
