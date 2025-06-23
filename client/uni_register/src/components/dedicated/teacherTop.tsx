import TopNav from '../reusable/top';

type TeacherTopProps = {

}

export default function TeacherTop(props: TeacherTopProps){
    return(
        <div className="">
          <TopNav 
            header="UniRegister | Teacher" 
            sections={
              [
                {name: "Classes", func: () => alert("To be implemented")},
                {name: "Timetable", func: () => alert("To be implemented")},
                {name: "Students", func: () => alert("To be implemented")},
                {name: "Mail", func: () => alert("To be implemented")},
              ]
            }
            accountFunc={() => alert("To be implemented")}
          ></TopNav>
        </div>
    );
}
