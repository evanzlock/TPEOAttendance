import React, { useState, useEffect } from 'react';
import configData from "../configurl.json";
import Button from '@mui/material/Button';
var url = configData.DEV_URL;
console.log(url);

export default function CreateMeeting(props) {
    var style = {
        background: props.color,
        boxShadow: '0px 0px 20px 3px rgba(0, 0, 0, 0.05)',
        borderRadius: '10px',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: '24px',
        lineHeight: '29px',
        color: '#000000',
        cursor: 'pointer',
        margin: '20px'
    
    } 
    const [meetingInfo, setInfo] = useState({
        code: "",
        type: "",
        startTime: null,
        endTime: null
    })
    const [toggleInfo, showInfo] = useState(false);
    const [isPending, setPending] = useState(false);
    const [isActive, setActive] = useState(false);
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
    //change toggle info so generate meeting is shown again
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
            .then(() => console.log("third then"),
                setActive(false),
                showInfo(!toggleInfo),
                console.log(isActive, toggleInfo));
    }
    function end(e) {
        e.preventDefault();
        fetch(`${url}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
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
        e.preventDefault();
        setPending(true);
        const info = JSON.stringify(meetingInfo);
        console.log(info);
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
        setInfo(newInfo);
    }
    function showForm(e) {
        e.preventDefault();
        showInfo(true);
    }
    // TODO: change toggle so ending a meeting shows generate meeting
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
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                </select>
                {!isPending && <Button variant="contained" type="submit">Begin Meeting</Button>}
                {isPending && <button disabled type="submit">Generating Meeting</button>}
            </form>}
            {/* {isActive && <Timer minutes={meetingInfo.duration}></Timer>} */}
            {isActive && <button onClick={cancel}>Cancel Meeting</button>}
            {isActive && <button onClick={end}>End Meeting</button>}
        </div>

    )
}