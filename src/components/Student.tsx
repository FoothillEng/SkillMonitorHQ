interface StudentProps {
    studentData: IStudent
}

const Student = ({studentData}: StudentProps) => {
    
    return (
        <div>
            {studentData.name}
        </div>
    )    
}

export default Student;


