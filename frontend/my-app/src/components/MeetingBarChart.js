import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import configData from "../configurl.json";
var URL = configData.URL;

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement
)


const MeetingBarChart = (props) => {

    const [chart, setChart] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`${URL}/MeetingBarData?type=${props.type}`, {
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

    }, [props.type])

    var data = {
        labels: chart.map(x => x.meetingNumber),
        datasets: [{

            label: 'Attendance Overview',
            data: chart.map(x => x.attendancePercent),
            backgroundColor: [
                props.color,
            ],
            borderWidth: 0.5
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
                display: false
            }
        },
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Percent Attended"

                }
            },
            x: {
                title: {
                    display: true,
                    text: "Meeting Number"

                },
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