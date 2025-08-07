import React, { useState, useContext, useEffect } from "react";
import { FaUserTie, FaCamera, FaUser, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { TbPasswordUser } from "react-icons/tb";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../components/loginAuth/authContext";
import '../../components/landingpage.css';
import './profile.css'; // Updated CSS file
import Footer from "../../components/footer/footer";
import { IoMdInformationCircleOutline, IoMdClose } from "react-icons/io";
import { Tooltip, Input, Modal, Button, ConfigProvider, Form } from "antd";
import { FaUserPlus } from "react-icons/fa6";
import logo from '../../assets/cloudxsuite_logo.png'
import Notification from "./notification";
import axios from 'axios';
import { UserOutlined } from "@ant-design/icons";
import dummyImage from '../../assets/avatar.png'; // Assuming you have a dummy image for profile


export default function Profile(props) {
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("")
  const [message, setMessage] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  let S3 = ""

  const { user, signIn, signUp } = useContext(AuthContext);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    let payload = {
      email: sessionStorage.getItem("email")
    }

    const profileImageFetchUrl = "https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/fetch-profile-image-filePath-to-dynamodb"

    axios.post(profileImageFetchUrl, payload).then((res) => {
      console.log("Filepath of image in useEffect", res.data.filePath)
      setFilePath(res.data.filePath)
    }).catch((err) => {
      console.log("filepath in useEffect", err)
    })
  }, [])

  const imageUploadAPI = "https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/Profile-Image-PresignedURL"

  const handleOk = () => {
    props.setChangeProfile(false);
  };

  const handleCancel = () => {
    props.setChangeProfile(false);
    setFile(null);
    setPreviewImage(null);
  };

  const handleSignUpImages = () => {
    const email = sessionStorage.getItem("email")
    console.log("file name", file)
    if (file !== null) {
      setLoading(true);
      axios.post(imageUploadAPI, {
        email: email,
        filename: file.name,
        contentType: "image/png"
      }).then((res) => {
        console.log("Presigned url", res)
        S3 = res.data.presignedUrl
        axios.put(S3, file, {
          headers: {
            "Content-Type": file.type,
          },
        }).then((res) => {
          console.log("Uploaded file", res.statusText)
          console.log("Uploaded file details", res)
        }).catch((err) => {
          console.log("error", err)
        })
        SavedProfilePathToDynamodb(email, res.data.filePath)
      }).catch((err) => {
        console.log("error", err)
        setLoading(false);
      })
    } else {
      setMessage('No Image Selected')
      setDescription('Please select a profile picture to upload.')
      setType('warning')
    }
  }

  const profilepicturetoDb = "https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/save-profile-image-filePath-to-dynamodb"

  const SavedProfilePathToDynamodb = (email, filePath) => {
    let payload = {
      email: email,
      filePath: filePath,
      filename: file.name
    }

    axios.post(profilepicturetoDb, payload).then((res) => {
      console.log("Successfully saved profile image to Dynamodb", res)
      setMessage('Profile Updated!')
      setDescription('Your profile picture has been updated successfully.')
      setType('success')
      setLoading(false);
      setTimeout(() => {
        props.setChangeProfile(false)
        setFile(null);
        setPreviewImage(null);
      }, 2000);
    }).catch((error) => {
      console.log("error is", error)
      setLoading(false);
    })
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  let formData = new FormData();
  const onfileChange = (e) => {
    if (e.target && e.target.files[0]) {
      formData.append("File_Name", e.target.files[0])
      console.log(formData)
      setFile(e.target.files[0])
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <div className="profile-overlay">
      <Notification type={type} message={message} description={description} />
      
      <div className="profile-modal-container">
        <div className="profile-modal">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-header-content">
              <h2 className="profile-title">My Profile</h2>
              <p className="profile-subtitle">Manage your account information</p>
            </div>
            <button className="profile-close-btn" onClick={handleCancel}>
              <IoMdClose />
            </button>
          </div>

          {/* Profile Content */}
          <div className="profile-content">
            {/* Main Content Grid */}
            <div className="profile-main-grid">
              {/* Left Side - Profile Picture */}
              <div className="profile-picture-section">
                <div className="profile-picture-container">
                  <div className="profile-picture-wrapper">
                    {!filePath && !previewImage ? (
                      <div className="default-profile-picture">
                        <img src={dummyImage} className="user-avatar" alt="Profile"/>

                      </div>
                    ) : (
                      <img 
                        src={previewImage || filePath} 
                        alt="Profile" 
                        className="profile-picture"
                      />
                    )}
                    <div className="profile-picture-overlay">
                      <FaCamera />
                      <span>Change Photo</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={sessionStorage.getItem("role") === "Guest User" ? true : false}
                    onChange={onfileChange}
                    className="profile-picture-input"
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" className="profile-picture-label">
                    <Tooltip title="Upload profile picture in JPG or PNG format">
                      <div className="upload-button">
                        <FaCamera />
                        <span>{filePath ? 'Change Picture' : 'Upload Picture'}</span>
                      </div>
                    </Tooltip>
                  </label>
                </div>
              </div>

              {/* Right Side - Account Information */}
              <div className="account-info-section">
                <h3 className="section-title">Account Information</h3>
                
                <div className="account-info-grid">
                  <div className="account-info-card">
                    <div className="info-icon-wrapper">
                      <FaUser className="account-icon" />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Full Name</div>
                      <div className="info-value">{sessionStorage.getItem("name")}</div>
                    </div>
                  </div>

                  <div className="account-info-card">
                    <div className="info-icon-wrapper">
                      <FaEnvelope className="account-icon" />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Email Address</div>
                      <div className="info-value">{sessionStorage.getItem("email")}</div>
                    </div>
                  </div>

                  <div className="account-info-card account-type-card">
                    <div className="info-icon-wrapper">
                      <FaShieldAlt className="account-icon" />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Account Type</div>
                      <div className="account-type-badge">
                        {sessionStorage.getItem("role")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="profile-footer">
            <div className="profile-actions">
              <Button
                className="cancel-btn"
                onClick={handleCancel}
                size="large"
              >
                Cancel
              </Button>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#DA5B9B',
                    borderRadius: 8,
                  },
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={handleSignUpImages}
                  className="save-btn"
                  disabled={!file}
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </Button>
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
