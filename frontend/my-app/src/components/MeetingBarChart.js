import React, {useState, useEffect} from 'react'
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale} from 'chart.js'
import {Bar} from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement
)


const MeetingBarChart = (props) => {

    const [chart, setChart] = useState([]);

    useEffect(() => {
     const fetchData = async () => {
        await fetch('http://localhost:5000/MeetingBarData?type=' + props.type, {
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
                props.color,
            ],
            borderWidth: 1
        }]

}

var options = {
    plugins: {
        title: {
            display: true,
            text: "Numerical Overview",
            align: "start",
            padding: {
                top: 30,
                bottom: 30
            }
        },
        legend: {
             display:false
        }
    },
    //maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
        },
        x: {
            grid: {
                lineWidth: 0
            }
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

export default MeetingBarChart