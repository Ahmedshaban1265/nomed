import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(false);
    const [userRole, setUserRole] = useState(null); // Add user role state

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        const storedToken = localStorage.getItem("authToken");
        const storedRole = localStorage.getItem("userRole");
        
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setUserRole(storedRole);
                setAuth(true);
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                localStorage.removeItem("userData");
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                setUser(null);
                setUserRole(null);
                setAuth(false);
            }
        }
    }, []);

    const login = (userData, token, role) => {
        console.log("User data received during login:", userData); // Added for debugging
        setUser(userData);
        setUserRole(role);
        setAuth(true);
        
        // Save data to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
    };

    const logOut = () => {
        console.log("Logging out, removing user data from localStorage");
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        setUser(null);
        setUserRole(null);
        setAuth(false);
    };

    // Function to get the token
    const getToken = () => {
        return localStorage.getItem("authToken");
    };

    // Function to check user type
    const isDoctor = () => {
        return userRole === "Doctor";
    };

    const isPatient = () => {
        return userRole === "Patient";
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logOut,
            auth,
            setAuth,
            userRole,
            getToken,
            isDoctor,
            isPatient,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};


