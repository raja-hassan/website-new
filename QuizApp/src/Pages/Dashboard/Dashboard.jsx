import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import PeiChartComponent from "./PieChart";
import CountBiscuit from "./CountBiscuit";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";

const Dashboard = () => {
    const userId = useSelector((state) => state.user.userId);
    const [exams, setExams] = useState([]);
    const [bisucitData, setBisuitData] = useState([]);
    const [totalExams, setTotalExams] = useState();
    const [attemptedExams, setAttemptedExams] = useState(0);
    const [pendingExams, setPendingExams] = useState(0);
    const [passExams, setPassExams] = useState(0);
    const [failExams, setFailExams] = useState(0);
    const [examSubjects, setExamSubjects] = useState([]);

    const getExam = async () => {
        if (!userId) return;
    
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_HOST}/exam?user=${userId}`,
            { method: "GET" }
          );
          const result = await response.json();
          if (response.ok) {
            setExams(result.data || []);
          } else {
            console.error("Error fetching exams:", result.message);
          }
        } catch (error) {
          console.error("Error fetching exams:", error);
        }
    }
    useEffect(() => {
        getExam()
    }, [])

    useEffect(() => {
        if(!exams)  return

        let total=0, attempted = 0, pending = 0, passed = 0, failed = 0, percentage, examSub=[];
        
        total = exams?.length
        exams.forEach((item) => {
            
            if(item.isCompleted) attempted++
            else pending++

            percentage = ((item.obtainedScore / item.totalScore)*100).toFixed(2)
            if(percentage >= 50)    passed++
            else if(item.isCompleted) failed++

            if(!examSub.find(a => a.name === item.subject.name))
                examSub.push({name:item.subject.name})
        })
        setTotalExams(total)
        setAttemptedExams(attempted)
        setPendingExams(pending)
        setPassExams(passed)
        setFailExams(failed)
        setExamSubjects(examSub)
    }, [exams])
    
    useEffect(()=>{
        const subjectCounts = exams.reduce((acc, exam) => {
            acc[exam.subject.name] = (acc[exam.subject.name] || 0) + 1;
            return acc;
        }, {});

        const data = examSubjects.map((item, i) => ({
            name:item.name,
            count:subjectCounts[item.name] || 0
        }))

        data.unshift({name:'Total exams', count:totalExams}, {name:'Pending Exams', count: pendingExams})
        setBisuitData(data)
    }, [examSubjects])

    return(
        <div className="container-fluid">
            <div className="page-wrapper">
                <LeftSidebar />
                <div className="right-side-content">
                    <div className="row my-4 py-4">
                        <div className="col d-flex flex-column align-items-center">
                            <h2 className="mb-1">Total Exams Ratio</h2>
                            <PeiChartComponent
                                data={[
                                    {name: 'Attempted', value: attemptedExams, color:'#0d6efd'},
                                    {name: 'Pending', value: pendingExams, color:'#6c757d'}
                                ]}
                            />
                        </div>
                        <div className="col d-flex flex-column align-items-center">
                            <h2 className="mb-1">Exams Pass/Fail Percentage</h2>
                            <PeiChartComponent
                                data={[
                                    {name: 'Pass', value: passExams, color:'#198754'},
                                    {name: 'Fail', value: failExams, color:'#dc3545'}
                                ]}
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-4">Subject Wise Exam count</h2>
                        <CountBiscuit
                            data={bisucitData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;