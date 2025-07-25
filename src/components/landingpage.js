import React, { useState, useContext } from "react";
import { FaUserTie  } from "react-icons/fa";
import { TbPasswordUser  } from "react-icons/tb";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./loginAuth/authContext";
import './landingpage.css';
import Footer from "./footer/footer";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Tooltip, Input, Modal, Button, ConfigProvider, Form, } from "antd";
import { FaUserPlus } from "react-icons/fa6";
import logo from '../assets/cloudxsuite_logo.png'
import Notification from "./features/notification";
import axios from 'axios';
import { LinearGradient } from 'react-text-gradients'

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
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


  const imageUploadAPI="https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/Profile-Image-PresignedURL"

  const passwordPolicy = {
    minLength: 8,
    hasUppercase: true,
    hasLowercase: true,
    hasNumber: true,
    hasSymbol: true,
  };

  const validatePassword = (_, value) => {
    if (!value) {
      setIsValid(true); // Don't show error if field is empty
      return Promise.resolve();
    }

    const { minLength, hasUppercase, hasLowercase, hasNumber, hasSymbol } = passwordPolicy;

    let valid = true;

    if (value.length < minLength) valid = false;
    if (hasUppercase && !/[A-Z]/.test(value)) valid = false;
    if (hasLowercase && !/[a-z]/.test(value)) valid = false;
    if (hasNumber && !/[0-9]/.test(value)) valid = false;
    if (hasSymbol && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) valid = false;

    setIsValid(valid);

    if (valid) {
      return Promise.resolve();
    } else {
      return Promise.reject('Password does not meet criteria.');
    }
  };

  const tooltipContent = (
    <div>
      <p>Password must meet the following criteria:</p>
      <ul>
        <li>Minimum length: {passwordPolicy.minLength}</li>
        {passwordPolicy.hasUppercase && <li>Contains an uppercase letter</li>}
        {passwordPolicy.hasLowercase && <li>Contains a lowercase letter</li>}
        {passwordPolicy.hasNumber && <li>Contains a number</li>}
        {passwordPolicy.hasSymbol && <li>Contains a symbol (@ # $)</li>}
      </ul>
      {!isValid && <p style={{ color: 'red' }}>Password does not meet criteria.</p>}
    </div>
  );


  const handleSignup=()=>{
    setIsModalOpen(true);
  }

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setType('');
    setLoginLoading(true);
    if(username==="" || password===""){
      setMessage('Missing Credentials')
      setDescription(`It looks like you're missing either your email or password. Please double-check and try again.`)
      setType('warning')
      setLoginLoading(false);
    }
    else{
      try {
        await signIn(username, password);
        setLoginLoading(false);
        // Redirect to the app's main page or dashboard
      } catch (err) {
        console.log(err.message);
        setMessage('Login Failed')
        setDescription(`The email or password you entered is incorrect. Please try again.`)
        setType('error')
        setLoginLoading(false);
      }
    }
  };

  const handleGuest=(e)=>{
    setType('');
    setUsername("guestuser@cloudxsuite.com")
    setPassword("Test@123")
    setMessage('Guest Mode Activated')
    setDescription(`Enjoy limited access. Create an account to unlock all features and save your progress.`)
    setType('info')
    e.preventDefault()
  }

    const handleSignUpImages=()=>{
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
        handleSignupSubmit(res.data.filePath)
      }).catch((err)=>{
        console.log("error", err)
      })
    }else{
      handleSignupSubmit(null)
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
    }).catch((error)=>{
      console.log("error is", error)
    })
  }


  const handleSignupSubmit = async(filePath) => {
    console.log("File Path: ", filePath)
    setType('');
    console.log("Signup", name, email, newPassword, confirmPassword)
    setLoading(true);
    if(email==="" || newPassword==="" || confirmPassword ==="" || name==="" || !isValid){
      
      setMessage('Missing Required Information')
      setDescription(`Please complete all the necessary information to finish your registration. Additionally, your password must adhere to the policy described in 'i' button.`)
      setType('warning')
      setLoading(false);
    }
    else{
      try {
        const result = await signUp(name, email, newPassword, 'User');
        SavedProfilePathToDynamodb(email, filePath)

        setMessage('Signup Successful!')
        setDescription('Welcome to CloudX Suite! You can now log in and explore.')
        setType('success')

        console.log('Signup successful:', result);
        setLoading(false);

      } catch (error) {
        console.error('Signup error:', error);
        SavedProfilePathToDynamodb(email, filePath)

        setMessage('Signup Failed')
        setDescription('An unexpected error occurred. Please try again later.')
        setType('error')
        setLoading(false);
      }
      setIsModalOpen(false);
    }
  };

  if (user) {
    // Redirect to the profile page
    if(sessionStorage.getItem("role")=="Administrator"){
      return <Navigate to="/admin/creditcard" />;
    }
    else if(sessionStorage.getItem("role")=="Guest User"){
      return <Navigate to="/guest" />;
    }
    else{
      return <Navigate to="/user" />;
    }
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
    <div  style={{ overflowX: "hidden", minHeight:'80vh', width: "100%", backgroundColor:'#EBE8DB' }}>

      {/* Navbar and Signup */}

      <div style={{display:'flex'}}>

        {/* Navbar starts */}


        <div style={{display:'flex'}}>
          <span>
            <img src={logo} style={{height:'50px', width:'60px', marginLeft:'90%',}} />
          </span>
          <span style={{marginLeft:'60px', marginTop:'6px', fontSize:'25px', fontWeight:'bold'}}>
            <LinearGradient gradient={['to left', '#DA5B9B ,#6B96F4']}>
              CloudX Suite
            </LinearGradient>
          </span>
        </div>


        {/* Navbar ends */}

        {/* Signup starts */}


        <div
            onClick={handleSignup}
            style={{
                paddingTop:'5px',
                color:'black',
                cursor:'pointer',
                fontSize:'25px',
                textAlign:'center',
                marginLeft:'75%',
                marginTop:'5px',
                borderRadius:'70px', 
                marginBottom:'14px'
            }}
        >
            <Tooltip title="New here? Sign up to enjoy full functionality and save your work." placement="bottom">
                <span onClick={handleSignup}>
                  <FaUserPlus  />
                </span>
            </Tooltip>
        </div>

        {/* Create account form starts */}

        <div>
          <Notification type={type} message={message} description={description} />
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
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
            <div style={{textAlign:'center', fontSize:'20px', fontWeight:'bold'}}>Create Account</div> <br/>
            <Form
             {...formItemLayout}
              form={form}
              onFinish={handleSignupSubmit}
              name="register"
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your full name!',
                  },
                ]}
              >
                <div style={{display:'flex'}}>                  
                  <Input 
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                  <Tooltip placement="top" title="Enter your full name" >
                    <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                      <IoMdInformationCircleOutline/>
                    </span>
                  </Tooltip>
                </div>
              </Form.Item>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <div style={{display:'flex'}}>                  
                  <Input 
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                  <Tooltip placement="top" title="Enter Email ID" >
                    <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                      <IoMdInformationCircleOutline/>
                    </span>
                  </Tooltip>
                </div>
              </Form.Item>
              <Form.Item
                  name="password"
                  label="Password"
                  
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                    {
                      validator: validatePassword,
                    },
                  ]}
                  hasFeedback
              >
                <div style={{display:'flex'}}>
                  <Input.Password
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                      }}
                  />
                  <Tooltip style={{whiteSpace: 'pre-line'}} placement="top" title={tooltipContent} >
                    <span style={{cursor:'pointer',  marginLeft:'10px',fontSize:'20px'}}>
                      <IoMdInformationCircleOutline/>
                    </span>
                  </Tooltip>
                </div>
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The new password that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <div style={{display:'flex'}}>
                  <Input.Password  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}/>
                  <Tooltip placement="top" title="Please re-enter your password!" >
                    <span style={{cursor:'pointer',  marginLeft:'10px',fontSize:'20px'}}>
                      <IoMdInformationCircleOutline/>
                    </span>
                  </Tooltip>
                </div>
              </Form.Item>
              <Form.Item name="blogimage" label="Profile Image">      
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
        {/* Create account form ends */}


        {/* Signup ends */}
        
      </div>

      {/* Landing page information starts */}


      <div style={{ display: "flex", backgroundColor:'white', borderRadius:'30px', marginLeft:'30px', marginRight:'30px', marginTop:'3%', height:'500px', boxShadow: '0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%)'}}>
        
        
        <div
          style={{
            width: "50%",
            textAlign: "justify",
            marginLeft: "60px",
            marginTop: "2%",
            marginRight: "20px",
            fontSize: "20px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom:'60px', fontSize:'40px' }}>  
             <LinearGradient gradient={['to left', '#DA5B9B ,#6B96F4']}>
              CloudX Suite
             </LinearGradient>
          </div>
          <span style={{ fontWeight: "bold"}}>
            {" "}
            <LinearGradient gradient={['to left', '#DA5B9B ,#6B96F4']}>
              "Cloud-Powered Web Application with AWS & React"
            </LinearGradient>
            
          </span>{" "}
        
            A Cloud-based web platform integrating AWS services and ReactJS to offer secure authentication, AI-driven automation, and seamless task management. 
            <br/>
            <br/>
            <br/>

            The application features user authentication via AWS Cognito, task and expense management with data visualization, and AI-powered modules like a chatbot assistant. Future enhancements include real-time notifications, workflow automation, and deeper AI-driven insights, ensuring a scalable and intelligent cloud solution.
        
        </div>

        {/* Login form starts */}

        <div style={{ width: "50%" }}>
          <form
            style={{ width: "100%", marginTop: "20%", marginLeft: "5%" }}
            onSubmit={handleSubmit}
          >
            <div className="input-container">
              <span style={{ fontSize: "30px", marginRight:'1%', color:'#DA5B9B' }}>
                <FaUserTie  />
              </span>
              <Input
                className="input-field"
                type="text"
                width={400}
                placeholder="Email ID"
                name="usrnm"
                value={username}
                required
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <Tooltip placement="top" title="Enter Email ID" >
                <span style={{cursor:'pointer', marginTop:'10px', marginLeft:'10px',fontSize:'20px'}}>
                  <IoMdInformationCircleOutline/>
                </span>
              </Tooltip>
            </div>
            <br/>
            <div className="input-container">
              <span style={{ fontSize: "30px", color:'#DA5B9B' }}>
                <TbPasswordUser  />
              </span>
              <Input.Password
                style={{ marginLeft: "2%" }}
                className="input-field"
                type="password"
                value={password}
                placeholder="Password"
                name="psw"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
              <Tooltip placement="top" title="Enter Password" >
                <span style={{cursor:'pointer', marginTop:'10px', marginLeft:'10px',fontSize:'20px'}}>
                  <IoMdInformationCircleOutline/>
                </span>
              </Tooltip>
            </div>

            <div style={{ display: "flex",marginTop:'5%' }}>

                <ConfigProvider
                  theme={{                                                    // To change color of antd buttons
                    token: {
                      colorPrimary: '#DA5B9B',
                      borderRadius: 6,
                      colorBgContainer: 'white',
                    },
                  }}
                >
                  <Button onClick={handleSubmit} variant="filled" loading={loginLoading} style={{marginRight:'10px'}}>
                    Login
                  </Button>
                </ConfigProvider>

                <ConfigProvider
                  theme={{                                                    // To change color of antd buttons
                    token: {
                      colorPrimary: '#a51d4a',
                      borderRadius: 6,
                      colorBgContainer: 'white',
                    },
                  }}
                >
                  <Button onClick={handleGuest} variant="Outlined" style={{marginRight:'10px'}}>
                    Guest login
                    <Tooltip placement="bottom" title="Try the app as a guest! Auto-filled credentials, full access requires sign-up." >
                      <span style={{cursor:'pointer', marginTop:'3px', marginLeft:'10px',fontSize:'20px'}}>
                        <IoMdInformationCircleOutline/>
                      </span>
                    </Tooltip>
                  </Button>
                </ConfigProvider>
            </div>
          </form>
        </div>

        {/* Login form end */}

      </div>


        {/* Footer */}


      <div style={{marginTop:'7.5%'}}>
        <Footer/>
      </div>
    </div>
  );
}
