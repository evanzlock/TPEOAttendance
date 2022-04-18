import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto"
import { Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import configData from "../configurl.json";
var URL = configData.URL;

const DonutChart = (props) => {
    const [chart, setChart] = useState();

    const fetchData = async () => {
        await fetch(`${URL}/DonutData?type=${props.type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((json) => {
                setChart(json[0].attendancePercent);
                return (json[0].attendancePercent);
            })
        }).catch(error => {
            console.log(error);
        })


    }

    useEffect(() => {
        fetchData();
    }, [props.type])

    var data = {
        datasets: [{
            data: [chart, 100 - chart],
            backgroundColor: [
                props.color,
                '#E5E5E5',
            ],
            borderColor: [
                '#0'
            ],
            borderWidth: 0.5
        }]

    }

    var options = {

        plugins: {
            title: {
                display: true,
                text: 'This Month'
            },
            legend: {
                display: false
            },
        },
        maintainAspectRatio: true,
        cutout: "50%"
    }

    return (
        <div>
            <Card border="light" align="center">
                <Card.Body >
                    <Doughnut
                        data={data}
                        options={options}
                        plugins={[{
                            beforeDraw: async function (chart) {
                                var width = chart.width,
                                    height = chart.height,
                                    ctx = chart.ctx;
                                ctx.restore();
                                var fontSize = (height / 400).toFixed(1);
                                ctx.font = fontSize + "em sans-serif";
                                ctx.textBaseline = "top";
                                var text = "",
                                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                                    textY = height / 2;
                                ctx.fillText(text, textX, textY);
                                ctx.save();
                            }
                        }]}
                    />
                    <div className='mt-2'>
                        <Card.Title> {Math.round(data.datasets[0].data[0])}%
                        </Card.Title>
                        <Card.Text>  of members were present this month
                        </Card.Text>
                    </div>
                </Card.Body>

            </Card>

        </div>
    );
}

export default DonutChart;