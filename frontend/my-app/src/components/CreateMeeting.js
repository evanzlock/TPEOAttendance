import React, { useState, useEffect } from 'react';
import configData from "../configurl.json";
import Button from '@mui/material/Button';
import Timer from "./Timer";
import "./Meeting.css";
var url = configData.DEV_URL;
console.log(url);

export default function CreateMeeting(props) {
    var style = {
        background: "#DADADA",
        "boxShadow": "0px 0px 20px 3px rgba(0, 0, 0, 0.05)",
        "borderRadius": "10px",
        "fontFamily": 'Montserrat',
        "fontStyle": "normal",
        "fontWeight": "400",
        "fontSize": "16px",
        "lineHeight": "20px",
        color: "#818181",
        "marginRight": "25px",
        "textAlign": "center"
    }
    var buttonstyle = {
        "width": "341px",
        "background": "#FFD5B8",
        "boxShadow": "0px 0px 20px 3px rgba(0, 0, 0, 0.05)",
        "borderRadius": "10px",
        "fontFamily": 'Montserrat',
        "fontWeight": "600",
        "fontSize": "24px",
        "lineHeight": "29px",
        "color": "#000000"
    }
    const [toggleInfo, showInfo] = useState(true);
    const [isPending, setPending] = useState(false);
    const [isActive, setActive] = useState(false);
    const [meetingNumber, setMeetingNumber] = useState("");
    useEffect(() => {
        console.log(`${url}/meeting/${props.type}`);
        fetch(`${url}/meeting/${props.type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => console.log(response))
            .then(data => {
                console.log(data);
                setMeetingNumber(data.data.number);
                setActive(data.data.activeMeeting);
                setInfo({
                    code: meetingInfo.code,
                    type: meetingInfo.type,
                    startTime: meetingInfo.startTime,
                    endTime: data.data.endTime,
                    tardyTime: meetingInfo.tardyTime
                })
                console.log(meetingNumber);
                console.log(isActive);
            })
    }, [props.type]);
    const [meetingInfo, setInfo] = useState({
        code: "",
        type: props.type,
        startTime: null,
        endTime: props.endTime,
        tardyTime: null
    })
    //send code, duration, and type to backend for attendance verification
    //change toggle info so generate meeting is shown again
    function cancel(e) {
        e.preventDefault();
        console.log(meetingInfo);
        const info = JSON.stringify(meetingInfo);
        fetch(`${url}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: info
        })
            .then(response => response.text())
            .then(text => console.log(text))
            .then(() => console.log("third then"),
                setActive(false),
                showInfo(!toggleInfo),
                console.log(isActive, toggleInfo));
    }
    function end(e) {
        e.preventDefault();
        const info = JSON.stringify(meetingInfo);
        console.log(meetingInfo);
        fetch(`${url}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: info
        })
            .then(response => response.text())
            .then(text => console.log(text),
                console.log(isActive),
                console.log(toggleInfo))
            .then(() => setActive(false),
                showInfo(!toggleInfo),
                console.log(isActive),
                console.log(toggleInfo));
    }
    function submit(e) {
        console.log(meetingInfo);
        e.preventDefault();
        setPending(true);
        const info = JSON.stringify(meetingInfo);
        fetch(`${url}/meeting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: info
        })
            .then(response => response.text())
            .then(text => console.log(text))
            .then(data => {
                setPending(false);
                setActive(true);
                showInfo(!toggleInfo);
            })
            .catch((error) => {
                console.log('Error:', error);
                setPending(false);
                setActive(true);
            })
    }
    function handle(e) {
        let newInfo = {
            code: meetingInfo.code,
            startTime: meetingInfo.startTime,
            endTime: meetingInfo.endTime,
            tardyTime: meetingInfo.tardyTime,
            type: meetingInfo.type
        }
        var input = e.target.value;
        var key = e.target.id;
        if (key === 'duration') {
            console.log(parseInt(input))
            newInfo['startTime'] = Date.now();
            newInfo['endTime'] = Date.now() + 60000 * parseInt(input);
            newInfo['tardyTime'] = Date.now() + 10000 * parseInt(input);
        }
        else {
            newInfo[key] = input;
        }
        setInfo(newInfo);
    }
    return (
        <div className="flex-container-row">
            {/* <button onClick="showDiv()" id="initialButton">Create Meeting */}
            {/* {!toggleInfo && !isActive && <button style={style} variant="contained" onClick={showForm}>Generate Meeting #{meetingNumber}</button>} */}
            {!toggleInfo && isActive && meetingInfo.endTime > Date.now() && < h1 > There is a meeting in progress.</h1>}
            {!toggleInfo && isActive && meetingInfo.endTime > Date.now() && <Timer time={meetingInfo.endTime - Date.now()} color={props.color}></Timer>}
            {
                toggleInfo && <form onSubmit={(e) => submit(e)}>
                    <input className="button" id="code" required onChange={(e) => handle(e)} placeholder="Enter meeting code" type="text"></input>
                    <input className="button" id="duration" required onChange={(e) => handle(e)} placeholder="Enter meeting duration" type="number" style={style}></input>
                    {!isPending && <Button variant="contained" type="submit" className="submit">Begin Meeting</Button>}
                    {isPending && <button disabled type="submit" style={buttonstyle}>Generating Meeting</button>}
                </form>
            }
            {/* {isActive && <Timer minutes={meetingInfo.duration}></Timer>} */}
            {isActive && meetingInfo.endTime > Date.now() && <button onClick={cancel}>Cancel Meeting</button>}
            {isActive && meetingInfo.endTime > Date.now() && <button onClick={end}>End Meeting</button>}
        </div >

    )
}