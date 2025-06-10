import axios from 'axios';
import {
    CognitoUserPool,
    CognitoUser,
    CognitoUserAttribute ,
    AuthenticationDetails,
  } from "amazon-cognito-identity-js"

  const userPool = new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_UserPoolId,
    ClientId: process.env.REACT_APP_ClientId,
  })

  
  export function signUp(name, email, password, profile) {
    return new Promise((resolve, reject) => {
      const attributeList = [];
      console.log("signup attributes",name, email, password, profile)
      const emailAttribute = new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      });
      attributeList.push(emailAttribute);
  
      if (profile) {
        const profileAttribute = new CognitoUserAttribute({
          Name: 'profile', // Ensure this matches your Cognito attribute name
          Value: profile,
        });
        attributeList.push(profileAttribute);
      }

      if (name) {
        const nameAttribute = new CognitoUserAttribute({
          Name: 'name', // Ensure this matches your Cognito attribute name
          Value: name,
        });
        attributeList.push(nameAttribute);
      }
  
      userPool.signUp(email, password, attributeList, null, (result, err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  

  export function signIn(username, password) {
    return new Promise((resolve, reject) => {
        const authenticationDetails = new AuthenticationDetails({
          Username: username,
          Password: password,
        })
    
        const cognitoUser = new CognitoUser({
          Username: username,
          Pool: userPool,
        })
    
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve(result)
            console.log("Results:", result)
            console.log("profile:", result.idToken.payload.profile)
            console.log("UserName:", result.idToken.payload['cognito:username'])
            let payload={
              email: result.idToken.payload.email
            }

            const profileImageFetchUrl="https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/fetch-profile-image-filePath-to-dynamodb"

            axios.post(profileImageFetchUrl, payload).then((res)=>{
                console.log("Filepath of image after login", res.data.filePath)
                sessionStorage.setItem("filePath", res.data.filePath)
            }).catch((err)=>{
                console.log("filepath after login error",err)
            })

            const expiresAt = result.getAccessToken().getExpiration() * 1000; // ms
            sessionStorage.setItem("expiresAt", expiresAt);
            sessionStorage.setItem("role", result.idToken.payload.profile)
            sessionStorage.setItem("name", result.idToken.payload.name)
            sessionStorage.setItem("username", result.idToken.payload['cognito:username'])
            sessionStorage.setItem("email", result.idToken.payload.email)
            sessionStorage.setItem("accessToken", result.accessToken)
          },
          onFailure: (err) => {
            reject(err)
          },
        })
      })
  }
  
  export function signOut() {;
    const cognitoUser = userPool.getCurrentUser()
    console.log(cognitoUser)
    if (cognitoUser) {
      cognitoUser.signOut()
      sessionStorage.removeItem("filePath")
      sessionStorage.removeItem("role")
      sessionStorage.removeItem("name")
      sessionStorage.removeItem("username")
      sessionStorage.removeItem("email")
    }
  }
  
  export function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser()
    
        if (!cognitoUser) {
          reject(new Error("No user found"))
          return
        }
    
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(err)
            return
          }
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err)
              return
            }
            const userData = attributes.reduce((acc, attribute) => {
              acc[attribute.Name] = attribute.Value
              return acc
            }, {})
    
            resolve({ ...userData, username: cognitoUser.username })
          })
        })
      })
  }
  
  export function getSession() {
    const cognitoUser = userPool.getCurrentUser()
    return new Promise((resolve, reject) => {
      if (!cognitoUser) {
        reject(new Error("No user found"))
        return
      }
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err)
          return
        }
        resolve(session)
      })
    })
  }