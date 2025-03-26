import React, { useState, useContext } from "react";
import { FaUserTie  } from "react-icons/fa";
import { TbPasswordUser  } from "react-icons/tb";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./loginAuth/authContext";
import './landingpage.css';
import Footer from "./footer/footer";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Tooltip, Input, Modal, Button, ConfigProvider, notification, Form, } from "antd";
import { FaUserPlus } from "react-icons/fa6";
import logo from '../assets/cloudxsuite_logo.png'


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
  const [api, contextHolder] = notification.useNotification();

  const { user, signIn, signUp } = useContext(AuthContext);

  const [isValid, setIsValid] = useState(true);

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

  const openNotificationWithIcon1 = (type) => {
    if(type=='warning'){
      api[type]({
        message: 'Missing Credentials',
        description:
          `It looks like you're missing either your email or password. Please double-check and try again.`,
        showProgress: true,
        pauseOnHover:true,
      });
    }
    else if(type=='error'){
      api[type]({
        message: 'Login Failed',
        description:
          `The email or password you entered is incorrect. Please try again.`,
        showProgress: true,
        pauseOnHover:true,
      });
    }
  }

  const openNotificationWithIconGuestLogin = (type) => {
      api[type]({
        message: 'Guest Mode Activated',
        description:
          `Enjoy limited access. Create an account to unlock all features and save your progress.`,
        showProgress: true,
        pauseOnHover:true,
      });
  }




  const handleSignup=()=>{
    setIsModalOpen(true);
  }

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const openNotificationWithIcon = (type) => {
    if(type=='success'){
      api[type]({
        message: 'Signup Successful!',
        description:
          'Welcome to CloudX Suite! You can now log in and explore.',
        showProgress: true,
        pauseOnHover:true,
      });
    }
    else if(type=='warning'){
      api[type]({
        message: 'Missing Required Information',
        description:
          `Please complete all the necessary information to finish your registration. Additionally, your password must adhere to the policy described in 'i' button.`,
        showProgress: true,
        pauseOnHover:true,
      });
    }
    else{
      api[type]({
        message: 'Signup Failed',
        description:
          'An unexpected error occurred. Please try again later.',
        showProgress: true,
        pauseOnHover:true,
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginLoading(true);
    if(username==="" || password===""){
      openNotificationWithIcon1('warning')
      setLoginLoading(false);
    }
    else{
      try {
        await signIn(username, password);
        setLoginLoading(false);
        // Redirect to the app's main page or dashboard
      } catch (err) {
        console.log(err.message);
        openNotificationWithIcon1('error')
        setLoginLoading(false);
      }
    }
  };

  const handleGuest=(e)=>{
    setUsername("guestuser@cloudxsuite.com")
    setPassword("Test@123")
    openNotificationWithIconGuestLogin('info')
    e.preventDefault()
  }

  const handleSignupSubmit = async(e) => {
    e.preventDefault();
    console.log("Signup", name, email, newPassword, confirmPassword)
    setLoading(true);
    if(email==="" || newPassword==="" || confirmPassword ==="" || name==="" || !isValid){
      openNotificationWithIcon('warning')
      setLoading(false);
    }
    else{
      try {
        const result = await signUp(name, email, newPassword, 'User');
        openNotificationWithIcon('success')
        console.log('Signup successful:', result);
        setLoading(false);

      } catch (error) {
        console.error('Signup error:', error);
        openNotificationWithIcon('error')
        setLoading(false);
      }
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  if (user) {
    // Redirect to the profile page
    return <Navigate to="/dashboard" />;
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
  

  return (
    <div>

      {/* Navbar and Signup */}

      <div style={{display:'flex', backgroundColor:'#EBE8DB'}}>

        {/* Navbar starts */}


        <div style={{display:'flex'}}>
          <span>
            <img src={logo} style={{height:'50px', width:'60px', marginLeft:'90%',}} />
          </span>
          <span style={{marginLeft:'60px', marginTop:'6px', fontSize:'25px', fontWeight:'bold'}}>
            CloudX Suite
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
        {contextHolder}
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
                <Button type="primary" loading={loading} onClick={handleSignupSubmit}>
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

            </Form>
          </Modal>
          
        </div>
        {/* Create account form ends */}


        {/* Signup ends */}
        
      </div>

      {/* Landing page information starts */}


      <div style={{ overflowX: "hidden", minHeight:'91.5vh', backgroundColor:'#EBE8DB', height:'100%', width: "100%" }}>
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
            <div style={{ fontWeight: "bold", color: "#a51d4a", marginBottom:'60px', fontSize:'40px' }}>  
              CloudX Suite
            </div>
            <span style={{ fontWeight: "bold", color: "#a51d4a" }}>
              {" "}
              "Cloud-Powered Web Application with AWS & React"
              
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
                <span style={{ fontSize: "30px", marginRight:'1%', color:'#a51d4a' }}>
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
                <span style={{ fontSize: "30px", color:'#a51d4a' }}>
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
                        colorPrimary: '#a51d4a',
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

        <div style={{marginTop:'4%'}}>
          <Footer/>
        </div>
      </div>
    </div>
  );
}
