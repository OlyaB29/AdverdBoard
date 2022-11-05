import {createContext, useState} from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const[user, setUser] = useState(null);
    const [access, setAccess] = useState(null)
    const [refresh, setRefresh] = useState(null)
    const [userId, setUserId] = useState(null)
    const signIn = (newUser, newAccess, newRefresh, newId, cb) => {
        setUser(newUser);
        setAccess(newAccess);
        setRefresh(newRefresh);
        setUserId(newId);
        localStorage.setItem('user',newUser);
        localStorage.setItem('accessToken', newAccess);
        localStorage.setItem('refreshToken', newRefresh);
        localStorage.setItem('userId',newId);
        cb()
    }

    const signOut = (cb) => {
        setUser(null);
        setAccess(null);
        setRefresh(null);
        setUserId(null);
        cb()
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userId')
    }

    const value = {signIn, signOut}

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
};