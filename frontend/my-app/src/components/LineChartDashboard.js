import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js'
import { Line } from 'react-chartjs-2'

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
            label: 'Percent Attended',
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
        plugins: {
            title: {
                display: true,
                text: 'Attendance Overview'
            },
            legend: {
                display: false
            }
        },
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Percentt Attended"

                }
            },
            x: {
                title: {
                    display: true,
                    text: "Meeting Number"

                }
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
