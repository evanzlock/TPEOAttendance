import React, {useState, useEffect} from 'react'
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale} from 'chart.js'
import {Bar} from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement
)


const GenMeetingBarChart = () => {

    const [chart, setChart] = useState([]);

    useEffect(() => {
     const fetchData = async () => {
        await fetch('http://localhost:5000/MeetingBarData?type=General', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((json) => {
                setChart(json);
            })
        }).catch(error => {
            console.log(error);
        })

        }
        fetchData();

    }, [])

var data = {
    labels: chart.map(x => x.meetingNumber),
        datasets: [{

            label: 'Attendance Overview',
            data: chart.map(x => x.attendancePercent),
            backgroundColor: [
                '#FFD5B8',
            ],
            borderWidth: 1
        }]

}

var options = {
    title: {
        display: true,
        text: "Attendance Overview"

    },
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
        }
    }
}
  return (
    <div>
        <Bar 
            data={data}
            height={400}
            options={options}
        
        />
    </div>
  )
}

export default GenMeetingBarChart