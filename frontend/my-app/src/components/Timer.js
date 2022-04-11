import React, { useState, useEffect } from 'react';
import '../style.css';
import configData from "../config.json";
var URL = configData.URL;
export default function Timer(props) {

    const [time, setTime] = useState({
        second: '00',
        minute: String(Math.floor(props.time / 60000)),
        counter: Math.floor(props.time / 1000)
    })
    const [endTimer, stopTimer] = useState(false);
    useEffect(() => {
        let intervalId;
        //allow timer to go to 0
        if (time.counter > -2) {
            if (time.counter === -2) {
                stopTimer(true);
            }
            intervalId = setInterval(() => {
                const secondCounter = time.counter % 60;
                const minuteCounter = Math.floor(time.counter / 60);

                const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}` : secondCounter;
                const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}` : minuteCounter;

                setTime(prevState => ({
                    second: computedSecond,
                    minute: computedMinute,
                    counter: prevState.counter - 1
                }))
            }, 1000)
        }
        return () => clearInterval(intervalId);
    }, [time.counter])
    //put request to update members data when timer ends/meeting ends
    // useEffect(() => {
    //     fetch(`${URL}/update`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     })
    //         .then(response => response.text())
    //         .then(text => console.log(text))
    // }, [endTimer])
    return (
        <div className="container" style = {{background: props.color}}>
            <div className="time">
                <span className="minute">{time.minute}</span>
                <span>:</span>
                <span className="second">{time.second}</span>
            </div>
        </div>
    )
}

