import React, {useState, useEffect} from 'react'
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale} from 'chart.js'
import {Bar} from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement
)

const BarChartHorizontalDashboard = () => {
    const [chart, setChart] = useState([]);

    useEffect(() => {
     const fetchData = async () => {
        await fetch("http://localhost:5000/BarChartHorizData", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((json) => {
                console.log(json);
                setChart(json);
            })
        }).catch(error => {
            console.log(error);
        })

        }
        fetchData();

    }, [])

var data = {
    labels: ["Design", "Engineering", "General", "Product"],
        datasets: [{
            label: 'This Month',
            data: chart.map(x => x.attendancePercent),
            backgroundColor: [
                '#E6CDFF',
                '#FFC4DC',
                '#FFD5B8',
                '#B2D1FF',
            ],
            borderWidth: 1
        }]

}

var options = {
    plugins: {
        title: {
            display: true,
            text: 'This Month'
        },
        legend: {
             display:false
        }
    },
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                lineWidth: 0
            },
        },
        x: {
            grid: {
                lineWidth: 0
            },
            display: false
        }
    },
    indexAxis: 'y'
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

export default BarChartHorizontalDashboard;
