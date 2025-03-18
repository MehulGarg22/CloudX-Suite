import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
  } from "amazon-cognito-identity-js"
  import { cognitoConfig } from "./cognitoConfig"
  import { Navigate, useNavigate } from "react-router-dom";

  const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.UserPoolId,
    ClientId: cognitoConfig.ClientId,
  })

  
  export function signUp(username, email, password) {
    return new Promise((resolve, reject) => {
        userPool.signUp(
          username,
          password,
          [{ Name: "email", Value: email }],
          null,
          (err, result) => {
            if (err) {
              reject(err)
              return
            }
            resolve(result.user)
          }
        )
      })
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