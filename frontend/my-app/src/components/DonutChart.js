import React, {useEffect, useState} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS} from "chart.js/auto"

const DonutChart = (props) => {

    //should get this from automated meeting number, hardcoded for now
    const lastGenMeetingNum = 2;


    const [chart, setChart] = useState();

    const fetchData = async () => {
        await fetch("http://localhost:5000/DonutData?type=" + props.type + "&last=" + lastGenMeetingNum, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((json) => {
                setChart(json[0].attendancePercent);
            })
        }).catch(error => {
            console.log(error);
        })
        

        }

    useEffect(() => {
        fetchData();
    }, [])

var data = {
        datasets: [{
            data: [chart, 100-chart],
            backgroundColor: [
                props.color,
                '#FFFFFF',
            ],
            borderColor: [
                '#0'
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
    maintainAspectRatio: true,
}

     return (
         <div>
           <Doughnut 
             data={data} 
             options={options}
             plugins={[{
                beforeDraw: function(chart) {
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
            {/* /TODO: Fix so text is in center of circle */}
            <h1>{data.datasets[0].data[0]}%</h1>
            <p>of members were present</p>
            <p> at {props.type} Meetings</p>
        </div>
     );
   }

export default DonutChart;