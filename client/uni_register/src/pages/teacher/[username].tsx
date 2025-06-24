// pages/student/[username].tsx
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { getUserInfo } from "../../functions/auth";
import { UserInfo } from "../../interfaces/businessLogic";
import TeacherTop from "../../components/dedicated/teacherRelated/teacherTop";
import { UserInfoContext } from "../../interfaces/businessLogic";
export default function Teacher(){
  const router = useRouter();
  const { username } = router.query;
  const [userInfo, setUserInfo] = useState<UserInfo>();
  useEffect(() => {
    if(username && typeof(username) === "string"){
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
  }else if(userInfo.role !== "teacher"){
    return(
        <div>
            Access prohibited!
        </div>
    );
  }else{
    return(
        <div className="">
          <UserInfoContext value={userInfo}>
            <TeacherTop></TeacherTop>
          </UserInfoContext>
        </div>
    );
  }
};