import { useRouter } from "expo-router";
import { useEffect } from "react";
import LoginScreen from "./auth/LoginScreen";

export default function Index(){

  const router = useRouter();
   useEffect(()=>{
      const timeout = setTimeout(()=>{
        const isLoggedIn = true;
        if (isLoggedIn){
        router.navigate("/tabs/home");
      } else {
        return <LoginScreen />;
      }
      },1000)

      
   }, []);
}