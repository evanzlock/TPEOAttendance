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
        await fetch('http://localhost:5000/meetingHistory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((json) => {
                //find last meeting number for each
                var lastGen = 2;
                var lastEng = 2;
                var lastDes = 2;
                var lastProd = 2;
                var gendata = json.filter(x => (x.meetingType === 'Product' && x.meetingNumber == lastProd)||(x.meetingType === 'Engineering' && x.meetingNumber == lastEng) || (x.meetingType === 'General' && x.meetingNumber == lastGen) || (x.meetingType === 'Design' && x.meetingNumber == lastDes));
                gendata.sort(function(a, b) {
                    return parseFloat(a.meetingType) - parseFloat(b.meetingType);
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
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
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
