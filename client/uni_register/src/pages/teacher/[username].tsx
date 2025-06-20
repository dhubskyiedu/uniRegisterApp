// pages/student/[username].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUserInfo } from "../../functions/auth";
import { UserInfo } from "../../interfaces/businessLogic";
import TeacherTop from '../../components/dedicated/teacherTop';

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
          <TeacherTop></TeacherTop>
        </div>
    );
  }
};