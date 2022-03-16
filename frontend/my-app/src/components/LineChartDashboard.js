import React, {useState, useEffect} from 'react'
import {Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement} from 'chart.js'
import {Line} from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement
)


const LineChartDashboard = () => {

    const [chart, setChart] = useState([]);

    useEffect(() => {
     const fetchData = async () => {
        await fetch('http://localhost:5000/meetingHistory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((json) => {
                var gendata = json.filter(x => x.meetingType === 'General');
                gendata.sort(function(a, b) {
                    return parseFloat(a.meetingNumber) - parseFloat(b.meetingNumber);
                });
                setChart(gendata);
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
                '#FF6900'
            ],
            borderColor: [
                '#FF6900'
            ],
            borderWidth: 1
        }]

}

var options = {
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
        }
    }
}
  return (
    <div>
        <Line 
            data={data}
            height={400}
            options={options}
        
        />
    </div>
  )
}

export default LineChartDashboard
