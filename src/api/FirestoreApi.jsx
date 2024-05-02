import { firestore } from "../firebaseConfig";
import { addDoc,
        collection,
        onSnapshot,
        doc,
        updateDoc,
        query,
        where,
        setDoc,
        deleteDoc} from "firebase/firestore"
import { toast } from "react-toastify";

let postsRef = collection(firestore, "posts");
let userRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");
let commentRef = collection(firestore,"comments");
let connectionsRef = collection(firestore,"connections");

export const PostStatustoDB = (object) => {
    addDoc(postsRef, object)
    .then(() => {
        toast.success("Post created successfully!");
    })
    .catch((err) => {
        console.log(err);
    });
};

export const getStatus = (setAllStatus) => {
    onSnapshot(postsRef, (snapshot) => {
        setAllStatus(snapshot.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })
        );
    });
};

export const getSingleStatus = (setAllStatus,id) => {
    const singlePostQuery = query(postsRef,where("userID", "==" ,id));
    onSnapshot(singlePostQuery, (response) => {
        setAllStatus(
            response.docs.map((docs) => {
                return {...docs.data(), id: docs.id};
            })
        );
    });
};

export const getAllUsers = (setAllUsers) => {
    onSnapshot(userRef, (snapshot) => {
        setAllUsers(snapshot.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })
        );
    });
};

export const getSingleUser = (setCurrentProfile,email) => {
    const singleUserQuery = query(userRef,where("email","==",email));
    onSnapshot(singleUserQuery, (response) => {
        setCurrentProfile(
            response.docs.map((docs) => {
                return {...docs.data(),id: docs.id}
            })[0]
        );
    });
};

export const postUserData = async (object) => {
    /* addDoc(userRef, object)
    .then(() => {})
    .catch((err) => {
        console.log(err);
    });  */
    await setDoc(doc(firestore,"users",object.userID),object);
    await setDoc(doc(firestore,"userChats",object.userID),{
        chats:[],
    });
};

export const getCurrentUser = (setCurrentUser) => {
    onSnapshot(userRef, (response) => {
        setCurrentUser(response.docs.map((docs) => {
                return { ...docs.data(), userId: docs.id };
            })
            .filter((items) => {
                return items.email === localStorage.getItem('userEmail');
            })[0]
        );
    });
};

export const editProfile = (userId, payload) => {
    let userToEdit = doc(userRef, userId);
    updateDoc(userToEdit,payload)
    .then(() => {
        toast.success("Profile updated successfully!");
    })
    .catch((err) => {
        console.log(err);
    }); 
};

export const likePost = (userId, postId, liked) => {
    try{
        let docToLike = doc(likeRef, `${userId}_${postId }` );
        if(liked){
            deleteDoc(docToLike);
        }
        else{
            setDoc(docToLike, { userId, postId });
        }
    }
    catch(err){
        console.log(err);
    }
};

export const getLikeByUser = (userId, postId,setLiked, setLikesCount) => {
    try{
        let likeQuery = query(likeRef,where('postId','==',postId));
        onSnapshot(likeQuery,(response) => {
            let likes = response.docs.map((doc)=> doc.data())
            let likesCount = likes.length

            const isLiked = likes.some((like) => like.userId === userId)
            
            setLikesCount(likesCount);
            setLiked(isLiked);
        })
    }
    catch(err){
        console.log(err);
    }
};

export const postComment = (postId, comment, timeStamp, name ) => {
    try{
        addDoc(commentRef,{ postId, comment, timeStamp, name, });
    }
    catch(err){
        console.log(err);
    }
};

export const getComments = (postId, setComments) => {
    try{
        let singlePostQuery = query(commentRef, where("postId","==",postId));
        onSnapshot(singlePostQuery,(response) => {
            const comments = response.docs.map((doc) => {
                return { id: doc.id, ...doc.data(), }
            });
            setComments(comments);
        });
    } 
    catch(err){
        console.log(err);
    }
};

export const updatePost = (id, status, postImage) => {
    let postToUpdate = doc(postsRef, id);
    updateDoc(postToUpdate, { status, postImage })
    .then(() => {
        toast.success("Post updated successfully!");
    })
    .catch((err) => {
        console.log(err);
    }); 
    
};

export const deletePost = (id) => {
    let postToDelete = doc(postsRef, id);
    deleteDoc(postToDelete)
    .then(() => {
        toast.success("Post deleted successfully!");
    })
    .catch((err) => {
        console.log(err);
    }); 
};

export const addConnection = (userId, targetId) => {
    try{
        let connectionToAdd = doc(connectionsRef, `${userId}_${targetId }` );
       
        setDoc(connectionToAdd, { userId, targetId });
        toast.success("Connected Successfully!");
        
    }
    catch(err){
        console.log(err);
    }
};

export const getConnections = (userId, targetId, setIsConnected ) => {
    try{
        let connectionQuery = query(connectionsRef,where('targetId','==',targetId));

        onSnapshot(connectionQuery,(response) => {
            let connections = response.docs.map((doc)=> doc.data());

            const isConnected = connections.some((connection) => connection.userId === userId);

            setIsConnected(isConnected);
        });
    }
    catch(err){
        console.log(err);
    }
};

export const getConnectionedUsersId = (userId, setConnectedUsers ) => {
    try{
        let connectionQuery = query(connectionsRef,where('userId','==',userId));

        onSnapshot(connectionQuery,(response) => {
            let connections = response.docs.map((doc)=> {
                return {id: doc.id, ...doc.data(),}
            });

            setConnectedUsers(connections);
        });
    }
    catch(err){
        console.log(err);
    }
};