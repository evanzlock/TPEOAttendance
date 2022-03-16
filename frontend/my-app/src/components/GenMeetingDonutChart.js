import React, {useEffect, useState} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS} from "chart.js/auto"

const GenMeetingDonutChart = () => {

    //should get this from automated meeting number, hardcoded for now
    const lastGenMeetingNum = 2;


    const [chart, setChart] = useState();

    useEffect(() => {
     const fetchData = async () => {
        await fetch("http://localhost:5000/DonutData?type=General&last=" + lastGenMeetingNum, {
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
        fetchData();

    }, [])

var data = {
        datasets: [{
            data: [chart, 100-chart],
            backgroundColor: [
                '#FFD5B8',
                '#FFFFFF',
            ],
            borderColor: [
                '#0'
            ],
            borderWidth: 1
        }]

}

var options = {
    maintainAspectRatio: false,
}

   

    //TODO: Fix so text is in center of circle
    const plugins = [{
        beforeDraw: function(chart) {
         var width = chart.width,
             height = chart.height,
             ctx = chart.ctx;
             ctx.restore();
             var fontSize = (height / 160).toFixed(1);
             ctx.font = fontSize + "em sans-serif";
             ctx.textBaseline = "top";
             var text = "% attended",
             textX = Math.round((width - ctx.measureText(text).width) / 2),
             textY = height / 2;
             ctx.fillText(text, textX, textY);
             ctx.save();
        } 
      }]
   
   
   
     return (
      
           <Doughnut 
             data={data} 
             options={options}
             plugins={plugins} 
            />
     );
   }

export default GenMeetingDonutChart;