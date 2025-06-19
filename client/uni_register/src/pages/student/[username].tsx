// pages/student/[username].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUserInfo } from "../../functions/auth";
import { UserInfo } from "../../interfaces/businessLogic";
import Top from '@/components/reusable/top';

export default function Student(){
  const router = useRouter();
  const { username } = router.query;

  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    if(username && typeof(username) === "string") {
        getUserInfo(username).then((result) => {
            if(typeof(result) !== "number"){
                setUserInfo(result);
            }
        }).catch((error) => {
            console.log(error);
            setUserInfo(undefined);
        });
    }
  }, [username]);

  if(!userInfo){
    return(
        <div>
            Error
        </div>
    );
  }else{
    /*<div>
        <h1>{userInfo ? userInfo.username : ""}</h1>
        <p>Email</p>

        </div>*/
    return(
        <div className="">
          <Top 
            header="UniRegister | Student" 
            sections={
              [
                {name: "Home", func: () => alert("Home")},
                {name: "Log out", func: () => alert("Log out")}
              ]
            }
            logoutFunc={() => alert("To be implemented")}
            accountFunc={() => alert("To be implemented")}
          ></Top>
        </div>
    );
  }
};