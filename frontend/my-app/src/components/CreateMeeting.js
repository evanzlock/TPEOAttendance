<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import configData from "../configurl.json";
import Button from '@mui/material/Button';
var url = configData.DEV_URL;
console.log(url);
var style = {
    position: 'absolute',
    width: '396px',
    height: '71px',
    left: '320px',
    top: '165px',
    background: '#FFD5B8',
    boxShadow: '0px 0px 20px 3px rgba(0, 0, 0, 0.05)',
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '29px',
    color: '#000000',
    cursor: 'pointer'

}
export default function CreateMeeting(props) {
    const [meetingInfo, setInfo] = useState({
        code: "",
        type: "",
        startTime: null,
        endTime: null
=======
import React, { useState } from 'react';
import configData from "../config.json";
import Timer from "./Timer";
import Button from '@mui/material/Button';
const URL = configData.DEV_URL;
console.log(URL);
export default function CreateMeeting() {
    const [meetingInfo, setInfo] = useState({
        code: "",
        duration: "",
        type: ""
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
    })
    const [toggleInfo, showInfo] = useState(false);
    const [isPending, setPending] = useState(false);
    const [isActive, setActive] = useState(false);
<<<<<<< HEAD
    const [meetingNumber, setMeetingNumber] = useState("");
    useEffect(() => {
        console.log('use effect');
        fetch(`${url}/general`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                setMeetingNumber(data.data.number);
                setActive(data.data.activeMeeting);
                console.log(meetingNumber);
                console.log(isActive);
            })
    }, []);
    //send code, duration, and type to backend for attendance verification
    function cancel(e) {
        e.preventDefault();
        fetch(`${url}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.text())
            .then(text => console.log(text))
            .then(() => setActive(false),
                showInfo(!toggleInfo));
    }
    function end(e) {
        e.preventDefault();
        fetch(`${url}/update`, {
=======
    //send code, duration, and type to backend for attendance verification
    function cancel(e) {
        e.preventDefault();
        fetch(`${URL}/cancel`, {
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.text())
            .then(text => console.log(text))
            .then(() => setActive(false),
                showInfo(!toggleInfo));
    }
    function submit(e) {
        e.preventDefault();
        setPending(true);
<<<<<<< HEAD
        const info = JSON.stringify(meetingInfo);
        console.log(info);
        fetch(`${url}/meeting`, {
=======
        const data = JSON.stringify(meetingInfo);
        fetch(`${URL}/meeting`, {
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
<<<<<<< HEAD
            body: info
=======
            body: data
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
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
<<<<<<< HEAD
        let newInfo = {
            code: meetingInfo.code,
            type: meetingInfo.type,
            startTime: meetingInfo.startTime,
            endTime: meetingInfo.endTime
        }
        var input = e.target.value;
        var key = e.target.id;
        console.log(input)
        if (key === 'duration') {
            console.log(parseInt(input))
            newInfo['startTime'] = Date.now();
            newInfo['endTime'] = Date.now() + 60000 * parseInt(input);
        }
        else {
            newInfo[key] = input;
        }
=======
        const newInfo = {
            code: meetingInfo.code,
            duration: meetingInfo.duration,
            type: meetingInfo.type
        };
        newInfo[e.target.id] = e.target.value;
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
        setInfo(newInfo);
    }
    function showForm(e) {
        e.preventDefault();
        showInfo(true);
    }
    return (
        <div>
            {/* <button onClick="showDiv()" id="initialButton">Create Meeting */}
<<<<<<< HEAD
            {!toggleInfo && !isActive && <button style={style} variant="contained" onClick={showForm}>Generate Meeting #{meetingNumber}</button>}
            {!toggleInfo && isActive && <h1>There is already a meeting in progress.</h1>}
            {toggleInfo && <form onSubmit={(e) => submit(e)}>
                <input id="code" required onChange={(e) => handle(e)} placeholder="Enter meeting code" type="text"></input>
                <input id="duration" required onChange={(e) => handle(e)} placeholder="Enter meeting duration" type="number"></input>
                <select onChange={(e) => handle(e)} id="type" name="type">
                    <option value="" selected disabled hidden>Choose a Meeting Type</option>
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
=======
            {!toggleInfo && !isActive && <Button variant="contained" onClick={showForm}>Generate Meeting</Button>}
            {toggleInfo && <form onSubmit={(e) => submit(e)}>
                <input onChange={(e) => handle(e)} id="code" placeholder="Enter meeting code" type="text"></input>
                <input onChange={(e) => handle(e)} id="duration" placeholder="Enter meeting duration" type="number"></input>
                <select onChange={(e) => handle(e)} id="type" name="type">
                    <option value="" selected disabled hidden>Choose a Meeting Type</option>
                    <option value="general">General</option>
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="product">Product</option>
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
                </select>
                {!isPending && <Button variant="contained" type="submit">Begin Meeting</Button>}
                {isPending && <button disabled type="submit">Generating Meeting</button>}
            </form>}
<<<<<<< HEAD
            {/* {isActive && <Timer minutes={meetingInfo.duration}></Timer>} */}
            {isActive && <button onClick={cancel}>Cancel Meeting</button>}
            {isActive && <button onClick={end}>End Meeting</button>}
=======
            {isActive && <Timer minutes={meetingInfo.duration}></Timer>}
            {isActive && <button onClick={cancel}>Cancel Meeting</button>}
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
        </div>

    )
}