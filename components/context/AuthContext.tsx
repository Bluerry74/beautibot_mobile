import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    // const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //     const loadAuth = async () => {
    //         try {
    //             const storedAccessToken = await AsyncStorage.getItem(
    //                 "accessToken"
    //             );
    //             const storedRefreshToken = await AsyncStorage.getItem(
    //                 "refreshToken"
    //             );
    //             const storedUser = await AsyncStorage.getItem("user");
    //             if (storedAccessToken && storedUser) {
    //                 setAccessToken(storedAccessToken);
    //                 setRefreshToken(storedRefreshToken);
    //                 setUser(JSON.parse(storedUser));
    //             }
    //         } catch (err) {
    //             console.log("Failed to load auth from storage", err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     loadAuth();
    // }, []);
    const clearAuth = () => {
        setAccessToken(null);
        setRefreshToken(null);
    };

    const login = ({ accessToken, refreshToken, user }: any) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);
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
