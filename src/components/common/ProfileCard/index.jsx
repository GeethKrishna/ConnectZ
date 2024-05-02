import React, { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom';
import PostsCard from "../PostsCard/index"
import { addConnection, getSingleStatus, getSingleUser } from '../../../api/FirestoreApi';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import ImageUploadModal from '../ImageUploadModal';
import { uploadImageApi } from '../../../api/ImageUpload';
import "./index.scss"


export default function ProfileCard({ currentUser, onEdit }) {

  let location = useLocation();

  const [allStatus, setAllStatus] = useState([]);
  const [currentProfile, setCurrentProfile] = useState({});
  const [loginUser, setLoginUser] = useState(true);
  const [currentImage, setCurrentImage] = useState({});
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const getImage = (event) =>{
    setCurrentImage(event.target.files[0]);
  };

  const uploadImage = () => {
    //console.log(currentUser);
    uploadImageApi(currentImage, currentUser.userId, setModalOpen, setProgress, setCurrentImage);
  };

  useMemo(() => {
    if(location?.state?.email){
      getSingleStatus(setAllStatus, location?.state?.id);
      getSingleUser(setCurrentProfile,location?.state?.email);
      console.log(location?.state?.email);
      console.log(localStorage.getItem("userEmail"));
      if(location?.state?.email === localStorage.getItem("userEmail")){
        setLoginUser(true);
      }
      else{
        setLoginUser(false);
      }
    }
    else{
      getSingleStatus(setAllStatus, location?.state?.id);
    }
  },[]);

  return (
    <>
      { loginUser ? 
        <ImageUploadModal 
          modalOpen = {modalOpen} 
          setModalOpen = {setModalOpen} 
          getImage = {getImage} 
          uploadImage = {uploadImage}
          currentImage = {currentImage}
          progress = {progress}
        />
        :
        <></>
      }
      <div className='profile-card'>

        <img 
          className='profile-picture' 
          src={Object.values(currentProfile).length === 0 ? currentUser.imageLink : currentProfile?.imageLink} 
          alt='profie picture'
          onClick={() => setModalOpen(true)}
        />
        
        { loginUser ? 
          <div className='edit-btn'>
            <HiOutlinePencilSquare size={25} className='edit-icon' onClick={() => onEdit()} />
          </div>
          :
          <></>
        }

        <h4 className='user-name'>{
          Object.values(currentProfile).length === 0 ? currentUser.name : currentProfile?.name}
        </h4>

        <div className='details-outer'>
          <div className='details-left'>
          <p className='user-role'>{Object.values(currentProfile).length === 0 ? currentUser.headline : currentProfile?.headline}</p>          
          <p className='user-details'>{Object.values(currentProfile).length === 0 ? currentUser.location : currentProfile?.location}</p>
          <a className='user-details' target='_blank' href={Object.values(currentProfile).length === 0 ? currentUser.website : currentProfile?.website}>{Object.values(currentProfile).length === 0 ? currentUser.website : currentProfile?.website}</a>
          </div>
          <div className='details-right'>
          <p className='user-details'>{Object.values(currentProfile).length === 0 ? currentUser.college : currentProfile?.college}</p>
          <p className='user-details'>{Object.values(currentProfile).length === 0 ? currentUser.company : currentProfile?.company}</p>
          </div>
        </div>
      </div>

      <div className='profile-card'>
        <h3 className='headings'>About me</h3>
        <p className='user-details'>{Object.values(currentProfile).length === 0 ? currentUser.about : currentProfile?.about}</p>
        <h3 className='headings'>Skills</h3>
        <p className='user-details'>{Object.values(currentProfile).length === 0 ? currentUser.skills : currentProfile?.skills}</p>
        <h3 className='headings'>Education</h3>
        <p className='user-details'>{Object.values(currentProfile).length === 0 ? currentUser.education : currentProfile?.education}</p>
      </div>

      <div className='profile-posts'>
        { 
          allStatus.filter((item) => {
            return item.userEmail === (Object.values(currentProfile).length === 0 ? currentUser.email : currentProfile?.email)
          }).map((posts) => {
            return (
              <div key={posts.id}>
                <PostsCard posts={posts}/>
              </div>
            );
          })
        }
      </div>
    </>
  );
}