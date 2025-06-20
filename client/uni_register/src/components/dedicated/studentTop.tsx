import TopNav from '../reusable/top';

type StudentTopProps = {

}

export default function StudentTop(props: StudentTopProps){
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
            logoutFunc={() => alert("To be implemented")}
            accountFunc={() => alert("To be implemented")}
          ></TopNav>
        </div>
    );
}
