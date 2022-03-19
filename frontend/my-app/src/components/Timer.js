import React, { useState, useEffect } from 'react';
import '../style.css';
<<<<<<< HEAD
import configData from "../configurl.json";
var URL = configData.DEV_URL;
=======
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
export default function Timer(props) {

    const [time, setTime] = useState({
        second: '00',
        minute: String(props.minutes),
        counter: props.minutes * 60
    })
    const [isActive, setIsActive] = useState(false);
<<<<<<< HEAD
    const [endTimer, stopTimer] = useState(false);
    useEffect(() => {
        let intervalId;
        //allow timer to go to 0
        if (isActive && time.counter > -2) {
            if (time.counter === -2) {
                stopTimer(true);
            }
=======
    useEffect(() => {
        let intervalId;
        if (isActive && time.counter !== -1) {
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
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
    }, [isActive, time.counter])
<<<<<<< HEAD
    //put request to update members data when timer ends/meeting ends
    useEffect(() => {
        fetch(`${URL}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.text())
            .then(text => console.log(text))
    }, [endTimer])
=======
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
    function handleClick(e) {
        e.preventDefault();
        setIsActive(!isActive);
    }
    return (
        <div className="container">
            <div className="time">
                <span className="minute">{time.minute}</span>
                <span>:</span>
                <span className="second">{time.second}</span>
            </div>
            <div className="buttons">
                <button onClick={handleClick} className="start">
                    {isActive ? "Pause" : "Start"}
                </button>
            </div>
        </div>
    )
}

