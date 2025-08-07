import React, { useState, useContext } from "react";
import { FaUserTie } from "react-icons/fa";
import { TbPasswordUser } from "react-icons/tb";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./loginAuth/authContext";
import './landingpage.css';
import Footer from "./footer/footer";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Tooltip, Input, Modal, Button, ConfigProvider, Form } from "antd";
import { FaUserPlus } from "react-icons/fa6";
import { HiSparkles, HiShieldCheck, HiCloud, HiLightningBolt } from "react-icons/hi";
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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  let S3 = "";

  const { user, signIn, signUp } = useContext(AuthContext);
  const [isValid, setIsValid] = useState(true);

  const imageUploadAPI = "https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/Profile-Image-PresignedURL";

  const passwordPolicy = {
    minLength: 8,
    hasUppercase: true,
    hasLowercase: true,
    hasNumber: true,
    hasSymbol: true,
  };

  const validatePassword = (_, value) => {
    if (!value) {
      setIsValid(true);
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
    <div className="password-tooltip">
      <p>Password must meet the following criteria:</p>
      <ul>
        <li>Minimum length: {passwordPolicy.minLength}</li>
        {passwordPolicy.hasUppercase && <li>Contains an uppercase letter</li>}
        {passwordPolicy.hasLowercase && <li>Contains a lowercase letter</li>}
        {passwordPolicy.hasNumber && <li>Contains a number</li>}
        {passwordPolicy.hasSymbol && <li>Contains a symbol (@ # $)</li>}
      </ul>
      {!isValid && <p className="password-error">Password does not meet criteria.</p>}
    </div>
  );

  const handleSignup = () => {
    setIsModalOpen(true);
  };

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
    if (username === "" || password === "") {
      setMessage('Missing Credentials')
      setDescription(`It looks like you're missing either your email or password. Please double-check and try again.`)
      setType('warning')
      setLoginLoading(false);
    } else {
      try {
        await signIn(username, password);
        setLoginLoading(false);
      } catch (err) {
        console.log(err.message);
        setMessage('Login Failed')
        setDescription(`The email or password you entered is incorrect. Please try again.`)
        setType('error')
        setLoginLoading(false);
      }
    }
  };

  const handleGuest = (e) => {
    setType('');
    setUsername("guestuser@cloudxsuite.com")
    setPassword("Test@123")
    setMessage('Guest Mode Activated')
    setDescription(`Enjoy limited access. Create an account to unlock all features and save your progress.`)
    setType('info')
    e.preventDefault()
  }

  const handleSignUpImages = () => {
    if (file !== null) {
      axios.post(imageUploadAPI, {
        email: email,
        filename: file.name,
        contentType: "image/png"
      }).then((res) => {
        S3 = res.data.presignedUrl
        axios.put(S3, file, {
          headers: {
            "Content-Type": file.type,
          },
        }).then((res) => {
          console.log("Uploaded file", res.statusText)
        }).catch((err) => {
          console.log("error", err)
        })
        handleSignupSubmit(res.data.filePath)
      }).catch((err) => {
        console.log("error", err)
      })
    } else {
      handleSignupSubmit(null)
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
    }).catch((error) => {
      console.log("error is", error)
    })
  }

  const handleSignupSubmit = async (filePath) => {
    setType('');
    setLoading(true);
    if (email === "" || newPassword === "" || confirmPassword === "" || name === "" || !isValid) {
      setMessage('Missing Required Information')
      setDescription(`Please complete all the necessary information to finish your registration. Additionally, your password must adhere to the policy described in 'i' button.`)
      setType('warning')
      setLoading(false);
    } else {
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
    if (sessionStorage.getItem("role") == "Administrator") {
      return <Navigate to="/admin/creditcard" />;
    } else if (sessionStorage.getItem("role") == "Guest User") {
      return <Navigate to="/guest" />;
    } else {
      return <Navigate to="/user" />;
    }
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
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="clean-header">
        <div className="header-wrapper">
          <div className="brand-container">
            <div className="logo-wrapper">
              <img src={logo} alt="CloudX Suite" className="app-logo" />
            </div>
            <div className="brand-info">
              <h1 className="brand-title">
                <LinearGradient gradient={['to right', '#DA5B9B', '#6B96F4']}>
                  CloudX Suite
                </LinearGradient>
              </h1>
              <span className="brand-subtitle">Enterprise Cloud Platform</span>
            </div>
          </div>
          
          <div className="header-nav">
            <button className="signup-button" onClick={handleSignup}>
              <HiSparkles className="button-icon" />
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-container">
        <div className="content-wrapper">
          {/* Left Section - Information */}
          <section className="info-section">
            <div className="content-area">
              {/* <div className="status-badge">
                <HiShieldCheck className="badge-icon" />
                <span>Trusted by 10,000+ Organizations</span>
              </div> */}
              
              <h2 className="primary-heading">
                <LinearGradient gradient={['to right', '#DA5B9B', '#6B96F4']}>
                  {" "}Smart AI Cloud Solutions
                </LinearGradient>
              </h2>
              
              <p className="primary-description">
                A comprehensive cloud platform integrating AWS services with modern React architecture. 
                Experience secure authentication, intelligent automation, and seamless task management 
                designed for enterprise-scale operations.
              </p>

              <div className="benefits-section">
                <h3 className="benefits-title">Why Choose CloudX Suite?</h3>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <HiShieldCheck />
                    </div>
                    <div className="benefit-content">
                      <h4>Enterprise Security</h4>
                      <p>AWS Cognito integration with multi-factor authentication and enterprise-grade security protocols</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <HiLightningBolt />
                    </div>
                    <div className="benefit-content">
                      <h4>AI-Powered Automation</h4>
                      <p>Intelligent workflows, predictive analytics, and automated task management powered by machine learning</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <HiCloud />
                    </div>
                    <div className="benefit-content">
                      <h4>Scalable Infrastructure</h4>
                      <p>Built on AWS with auto-scaling capabilities, real-time data processing, and 99.9% uptime guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Section - Login Form */}
          <section className="auth-section">
            <div className="auth-container">
              <div className="auth-header">
                <h3 className="auth-title">Welcome Back</h3>
                <p className="auth-description">Sign in to access your cloud workspace</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label className="field-label">Email Address</label>
                  <div className="input-field">
                    <FaUserTie className="field-icon" />
                    <Input
                      className="field-input"
                      type="email"
                      placeholder="Enter your email address"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <Tooltip title="Enter your registered email address">
                      <IoMdInformationCircleOutline className="info-tooltip" />
                    </Tooltip>
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Password</label>
                  <div className="input-field">
                    <TbPasswordUser className="field-icon" />
                    <Input.Password
                      className="field-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Tooltip title="Enter your account password">
                      <IoMdInformationCircleOutline className="info-tooltip" />
                    </Tooltip>
                  </div>
                </div>

                <div className="form-buttons">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#4F46E5',
                        borderRadius: 8,
                      },
                    }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      loading={loginLoading}
                      onClick={handleSubmit}
                      className="primary-button"
                      block
                    >
                      Sign In to Your Account
                    </Button>
                  </ConfigProvider>

                  <div className="button-divider">
                    <span>or try without commitment</span>
                  </div>

                  <Button
                    size="large"
                    onClick={handleGuest}
                    className="secondary-button"
                    block
                  >
                    <span>Continue as Guest</span>
                    <Tooltip title="Explore with limited access. Full features require an account.">
                      <IoMdInformationCircleOutline className="button-tooltip" />
                    </Tooltip>
                  </Button>
                </div>
              </form>

              <div className="auth-footer">
                <p className="footer-text">
                  New to CloudX Suite? 
                  <button className="footer-link" onClick={handleSignup}>
                    Create your free account
                  </button>
                </p>
              </div>
            </div>
          </section>
          
        </div>
      </main>

      {/* Signup Modal */}
      <Notification type={type} message={message} description={description} />
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        className="signup-modal"
        width={650}
        centered
        footer={[
          <ConfigProvider
            key="submit"
            theme={{
              token: {
                colorPrimary: '#4F46E5',
                borderRadius: 8,
              },
            }}
          >
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleSignUpImages}
              className="modal-submit-btn"
            >
              Create Your Account
            </Button>
          </ConfigProvider>
        ]}
      >
        <div className="modal-body">
          <div className="modal-header">
            <h2>Join CloudX Suite</h2>
            <p>Create your account and unlock powerful cloud features</p>
          </div>

          <Form
            {...formItemLayout}
            form={form}
            className="modal-form"
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <div className="modal-input-group">
                <Input
                  size="large"
                  placeholder="Enter your complete name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Tooltip title="Enter your full name as it should appear on your profile">
                  <IoMdInformationCircleOutline className="modal-tooltip" />
                </Tooltip>
              </div>
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { type: 'email', message: 'Please enter a valid email address' },
                { required: true, message: 'Email address is required' }
              ]}
            >
              <div className="modal-input-group">
                <Input
                  size="large"
                  placeholder="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Tooltip title="Use a valid email address for account verification">
                  <IoMdInformationCircleOutline className="modal-tooltip" />
                </Tooltip>
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              label="Create Password"
              rules={[
                { required: true, message: 'Password is required' },
                { validator: validatePassword }
              ]}
              hasFeedback
            >
              <div className="modal-input-group">
                <Input.Password
                  size="large"
                  placeholder="Create a strong password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Tooltip title={tooltipContent}>
                  <IoMdInformationCircleOutline className="modal-tooltip" />
                </Tooltip>
              </div>
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match');
                  },
                })
              ]}
              hasFeedback
            >
              <div className="modal-input-group">
                <Input.Password
                  size="large"
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Tooltip title="Re-enter your password to confirm">
                  <IoMdInformationCircleOutline className="modal-tooltip" />
                </Tooltip>
              </div>
            </Form.Item>

            <Form.Item name="profileImage" label="Profile Picture (Optional)">
              <div className="file-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onfileChange}
                  className="file-upload-input"
                />
                <Tooltip title="Upload a profile picture in JPG or PNG format">
                  <IoMdInformationCircleOutline className="modal-tooltip" />
                </Tooltip>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Footer */}
        <Footer />
        
    </div>
  );
}
