import { useState } from 'react';
import TopNav from '../../reusable/top';
import Account from '../account';
import Security from '../security';
import WelcomePage from '../welcomePage';

type StudentTopProps = {

}

export default function StudentTop(props: StudentTopProps){
  const [shownMenu, setShownMenu] = useState<string>();
    return(
        <div className="">
          <TopNav 
            header="UniRegister | Student" 
            sections={
              [
                {name: "Classes", func: () => alert("To be implemented")},
                {name: "Grades", func: () => alert("To be implemented")},
                {name: "Timetable", func: () => alert("To be implemented")},
                {name: "Enrolment", func: () => alert("To be implemented")},
                {name: "Mail", func: () => alert("To be implemented")},
              ]
            }
            accountFunc={() => setShownMenu("account")}
          ></TopNav>
          {(() => {
            if (shownMenu === "account") return <Account switchToSecurityMenu={() => setShownMenu("security")}></Account>;
            if (shownMenu === "security") return <Security></Security>;
            return <div className="flex items-center justify-center p-10">
              <div className="text-center flex items-center justify-center">
                <WelcomePage></WelcomePage>
              </div>
            </div>;
          })()}
        </div>
    );
}
