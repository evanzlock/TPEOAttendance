import React, { useState, useEffect } from 'react';
import configData from "../configurl.json";
import Button from '@mui/material/Button';
var url = configData.DEV_URL;
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
        duration: "",
        type: "",
        startTime: null,
        endTime: null
    })
    const [toggleInfo, showInfo] = useState(false);
    const [isPending, setPending] = useState(false);
    const [isActive, setActive] = useState(false);
    const [meetingNumber, setMeetingNumber] = useState("");
    useEffect(() => {
        fetch(`${url}/general`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            //not sure why triggers 3 times on load
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
    function submit(e) {
        e.preventDefault();
        setPending(true);
        const info = JSON.stringify(meetingInfo);
        console.log(info);
        fetch(`${URL}/meeting`, {
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
            duration: meetingInfo.duration,
            type: meetingInfo.type,
            startTime: meetingInfo.startTime,
            endTime: meetingInfo.endTime
        }
        var input = e.target.value;
        var key = e.target.id;
        if (key === 'duration') {
            newInfo['startTime'] = Date.now();
            newInfo['endTime'] = Date.now() + 60000 * parseInt(input);
        }
        newInfo[input] = input;
        setInfo(newInfo);
    }
    function showForm(e) {
        e.preventDefault();
        showInfo(true);
    }
    return (
        <div>
            {/* <button onClick="showDiv()" id="initialButton">Create Meeting */}
            {!toggleInfo && !isActive && <button style={style} variant="contained" onClick={showForm}>Generate Meeting #{meetingNumber}</button>}
            {!toggleInfo && isActive && <h1>There is already a meeting in progress.</h1>}
            {toggleInfo && <form onSubmit={(e) => submit(e)}>
                <input id="code" required onChange={(e) => handle(e)} placeholder="Enter meeting code" type="text"></input>
                <input id="duration" required onChange={(e) => handle(e)} placeholder="Enter meeting duration" type="number"></input>
                <select onChange={(e) => handle(e)} id="type" name="type">
                    <option value="" selected disabled hidden>Choose a Meeting Type</option>
                    <option value="general">General</option>
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="product">Product</option>
                </select>
                {!isPending && <Button variant="contained" type="submit">Begin Meeting</Button>}
                {isPending && <button disabled type="submit">Generating Meeting</button>}
            </form>}
            {/* {isActive && <Timer minutes={meetingInfo.duration}></Timer>} */}
            {isActive && <button onClick={cancel}>Cancel Meeting</button>}
        </div>

    )
}