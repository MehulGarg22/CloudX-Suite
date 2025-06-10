import React, { useState, useContext, useEffect } from "react";
import { FaUserTie  } from "react-icons/fa";
import { TbPasswordUser  } from "react-icons/tb";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../components/loginAuth/authContext";
import '../../components/landingpage.css';
import Footer from "../../components/footer/footer";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Tooltip, Input, Modal, Button, ConfigProvider, Form, } from "antd";
import { FaUserPlus } from "react-icons/fa6";
import logo from '../../assets/cloudxsuite_logo.png'
import Notification from "./notification";
import axios from 'axios';
import { UserOutlined } from "@ant-design/icons";

export default function Profile(props) {
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ newPassword, setNewPassword] = useState("");
  const [ confirmPassword, setConfirmPassword] = useState("");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType]=useState("")
  const [message, setMessage]=useState("")
  const [description, setDescription]=useState("")
  const [file, setFile] = useState(null);
  let S3=""

  const { user, signIn, signUp } = useContext(AuthContext);

  const [isValid, setIsValid] = useState(true);

    useEffect(()=>{
        let payload={
            email: sessionStorage.getItem("email")
        }

        const profileImageFetchUrl="https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/fetch-profile-image-filePath-to-dynamodb"

        axios.post(profileImageFetchUrl, payload).then((res)=>{
            console.log("Filepath of image in useEffect", res.data.filePath)
            setFilePath(res.data.filePath)
        }).catch((err)=>{
            console.log("filepath in useEffect",err)
        })
    },[])

    const imageUploadAPI="https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/Profile-Image-PresignedURL"

    const handleOk = () => {
        props.setChangeProfile(false);
    };

    const handleCancel = () => {
        props.setChangeProfile(false);
    };



    const handleSignUpImages=()=>{
        const email=sessionStorage.getItem("email")
        console.log("file name", file)
        if(file!==null){
        axios.post(imageUploadAPI,{
            email: email,
            filename: file.name,
            contentType: "image/png"
        }).then((res)=>{
            console.log("Presigned url", res)
            S3=res.data.presignedUrl
            axios.put(S3, file, {
            headers: {
                "Content-Type": file.type,
            },
            }).then((res)=>{
            console.log("Uploaded file", res.statusText)
            console.log("Uploaded file details", res)
            }).catch((err)=>{
            console.log("error", err)
            })
            SavedProfilePathToDynamodb(email, res.data.filePath)
        }).catch((err)=>{
            console.log("error", err)
        })
        }
    }
  
    const profilepicturetoDb="https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/save-profile-image-filePath-to-dynamodb"

    const SavedProfilePathToDynamodb=(email, filePath)=>{
     

        let payload={
            email:email,
            filePath: filePath,
            filename: file.name
        }

        axios.post(profilepicturetoDb, payload).then((res)=>{
            console.log("Successfully saved profile image to Dynamodb", res)
            props.setChangeProfile(false)
        }).catch((error)=>{
            console.log("error is", error)
        })
    }


  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  

  let formData=new FormData();
  const onfileChange=(e)=>{
      if(e.target && e.target.files[0]){
          formData.append("File_Name", e.target.files[0])
          console.log(formData)
          setFile(e.target.files[0])
      }
  }


  return (
    <div>

      {/* Navbar and Signup */}

      <div style={{display:'flex', backgroundColor:'#EBE8DB'}}>

        {/* Create account form starts */}

        <div>
          <Notification type={type} message={message} description={description} />
          <Modal open={props.changeProfile} onOk={handleOk} onCancel={handleCancel}
            footer={[
              <ConfigProvider
                theme={{                                                    // To change color of antd buttons
                  token: {
                    colorPrimary: '#a51d4a',
                    borderRadius: 6,
                    colorBgContainer: 'white',
                  },
                }}
              >
                <Button type="primary" loading={loading} onClick={handleSignUpImages}>
                  Submit
                </Button>
              </ConfigProvider>
            ]}
          >
            <div style={{textAlign:'center', fontSize:'20px', fontWeight:'bold'}}>Profile</div> <br/>

            {
                !filePath ? 
                    <div style={{fontSize:'30px'}}>
                        <UserOutlined style={{margin:'auto', display:'block' }}/>
                    </div>
                    :
                    <img src={filePath} style={{height:'200px', margin:'auto', display:'block' ,borderRadius:'10px'}}/>
            }

            <br/>

            <Form
             {...formItemLayout}
              form={form}
              onFinish={handleSignUpImages}
              name="register"
            >

                <Form.Item
                name="name"
                label="Full Name"
                >
                <div style={{display:'flex'}}>                  
                    <Input 
                    style={{color:'black'}}
                    disabled={true}
                    value={sessionStorage.getItem("name")}
                    />
                </div>
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                >
                    <div style={{display:'flex'}}>                  
                    <Input 
                        style={{color:'black'}}
                        disabled={true}
                        value={sessionStorage.getItem("email")}
                    />
                    </div>
                </Form.Item>

                <Form.Item
                    name="accessType"
                    label="Access type"
                >
                    <div style={{display:'flex'}}>                  
                    <Input 
                        style={{color:'black'}}
                        disabled={true}
                        value={sessionStorage.getItem("role")}
                    />
                    </div>
                </Form.Item>

                <Form.Item name="blogimage" label="Change Profile Picture">      
                    <div style={{display:'flex', marginTop:'5px'}}>
                        <Tooltip style={{whiteSpace: 'pre-line', marginTop:'5px'}} placement="top" title="Upload profile picture in jpg/png format only" >
                            <span style={{cursor:'pointer',  marginLeft:'10px',fontSize:'20px'}}>
                            <IoMdInformationCircleOutline/>
                            </span>
                        </Tooltip>
                        <input style={{marginLeft:"10px", marginTop:'5px'}} onChange={(e)=> onfileChange(e)} type="file" />

                    </div>
                </Form.Item>

            </Form>
          </Modal>
          
        </div>
        
      </div>
    </div>
  );
}
