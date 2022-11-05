import {useContext} from 'react';
import {AuthContext} from "../hogs/AuthProvider";

export function useAuth() {
    return useContext(AuthContext);
}