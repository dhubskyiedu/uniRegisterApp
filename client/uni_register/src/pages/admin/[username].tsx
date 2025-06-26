// pages/student/[username].tsx
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { getUserInfo } from "../../functions/auth";
import { UserInfo } from "../../interfaces/businessLogic";
import { UserInfoContext } from "../../interfaces/businessLogic";
import AdminTop from '../../components/dedicated/adminRelated/adminTop';
export default function Teacher(){
  const router = useRouter();
  const {username} = router.query;
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
  }else if(userInfo.role !== "admin"){
    return(
        <div>
            Access prohibited!
        </div>
    );
  }else{
    return(
        <div className="">
          <UserInfoContext value={{userInfo: userInfo, setUserInfo: (info: UserInfo) => setUserInfo(info)}}>
            <AdminTop></AdminTop>
          </UserInfoContext>
        </div>
    );
  }
};