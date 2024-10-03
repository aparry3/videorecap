import { fetchUserByEmail } from "@/app/helpers/user";
import { User } from "@/lib/@types/Account"
import { useUser as useAuthUser, UserProvider as AuthUserProvider } from "@auth0/nextjs-auth0/client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react"


interface UserContextInterface  {user?: User, setUser: (user: User) => void, loading: boolean}

const UserContext = createContext<UserContextInterface | undefined>(undefined)


export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
  };
  

  interface UserProviderProps {
    children: ReactNode;
  }
  
  export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const {user: authUser, isLoading: authUserLoading} = useAuthUser()

    const fetchBetterLetterUser = async (email: string) => {
        const user = await fetchUserByEmail(email)
        setUser(user)
        setLoading(false)
    
    }
    useEffect(() => {
        if (!authUserLoading) {
            if (!authUser || !authUser.email) {
                setLoading(false)
            } else {
                fetchBetterLetterUser(authUser.email)
            }
        }
    }, [authUser, authUserLoading])

    return (
            <UserContext.Provider value={{ user, setUser, loading }}>
                {children}
            </UserContext.Provider>
    );
  };
  