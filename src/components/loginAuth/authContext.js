import { createContext, useState, useEffect } from "react"
import * as auth from "./auth"

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)


  const getCurrentUser = async () => {
    try {
      const user = await auth.getCurrentUser()
      setUser(user)
    } catch (err) {
      // not logged in
      console.log(err)
      setUser(null)
    }
  }

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false))

    // Auto logout on token expiry
    const checkExpiry = () => {
      const expiresAt = sessionStorage.getItem("expiresAt");
      if (expiresAt && Date.now() > Number(expiresAt)) {
        signOut();
        console.log("Session expired, user logged out automatically.");
        setUser(null);  
        sessionStorage.removeItem("expiresAt");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("email");
        
      }
    };
    const interval = setInterval(checkExpiry, 1000 * 60); // check every minute
    return () => clearInterval(interval);
    
  }, [])

  const signIn = async (username, password) => {
    await auth.signIn(username, password)
    await getCurrentUser()
  }
  const signOut = async () => {
    sessionStorage.removeItem("filePath")
    sessionStorage.removeItem("role")
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("username")
    sessionStorage.removeItem("email")
    await auth.signOut()
    setUser(null)
  }
  const signUp = async (name, email, password, profile) => {
    await auth.signUp(name, email, password, profile)
    await getCurrentUser()
  }
  

  const authValue = {
    user,
    isLoading,
    signIn,
    signOut,
    signUp
  }

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }