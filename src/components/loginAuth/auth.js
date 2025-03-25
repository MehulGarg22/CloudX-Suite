import {
    CognitoUserPool,
    CognitoUser,
    CognitoUserAttribute ,
    AuthenticationDetails,
  } from "amazon-cognito-identity-js"
  import { cognitoConfig } from "./cognitoConfig"

  const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.UserPoolId,
    ClientId: cognitoConfig.ClientId,
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

            localStorage.setItem("role", result.idToken.payload.profile)
            localStorage.setItem("name", result.idToken.payload.name)
            localStorage.setItem("username", result.idToken.payload['cognito:username'])
            localStorage.setItem("email", result.idToken.payload.email)
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