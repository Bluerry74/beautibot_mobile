import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext<any>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
      const [isLoading, setIsLoading] = useState(true);
      useEffect(() => {
        (async () => {
          try {
            const at = await AsyncStorage.getItem("accessToken");
            const rt = await AsyncStorage.getItem("refreshToken");
            const usr = await AsyncStorage.getItem("user");
            if (at) {
              setAccessToken(at);
              axios.defaults.headers.common["Authorization"] = `Bearer ${at}`;
            }
            if (rt) setRefreshToken(rt);
            if (usr) setUser(JSON.parse(usr));
          } catch (err) {
            console.log("Load auth failed", err);
          } finally {
            setIsLoading(false);
          }
        })();
      }, []);
    
    const clearAuth = () => {
        setAccessToken(null);
        setRefreshToken(null);
    };

    const login = async ({
        accessToken: newAT,
        refreshToken: newRT,
        user: newUser,
      }: any) => {
        // 2.1) Lưu vào state
        setAccessToken(newAT);
        setRefreshToken(newRT);
        setUser(newUser);
    
        // 2.2) Lưu vào AsyncStorage
        await AsyncStorage.setItem("accessToken", newAT);
        await AsyncStorage.setItem("refreshToken", newRT);
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
    
        // 2.3) **Thiết lập header cho Axios**
        axios.defaults.headers.common["Authorization"] = `Bearer ${newAT}`;
    
        // 2.4) Chuyển hướng
        router.replace("/home");
      };
      
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                accessToken,
                setAccessToken,
                refreshToken,
                setRefreshToken,
                clearAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
