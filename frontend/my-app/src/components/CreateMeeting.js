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
    })
    const [toggleInfo, showInfo] = useState(false);
    const [isPending, setPending] = useState(false);
    const [isActive, setActive] = useState(false);
    //send code, duration, and type to backend for attendance verification
    function cancel(e) {
        e.preventDefault();
        fetch(`${URL}/cancel`, {
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
        const data = JSON.stringify(meetingInfo);
        fetch(`${URL}/meeting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
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
        const newInfo = {
            code: meetingInfo.code,
            duration: meetingInfo.duration,
            type: meetingInfo.type
        };
        newInfo[e.target.id] = e.target.value;
        setInfo(newInfo);
    }
    function showForm(e) {
        e.preventDefault();
        showInfo(true);
    }
    return (
        <div>
            {/* <button onClick="showDiv()" id="initialButton">Create Meeting */}
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
                </select>
                {!isPending && <Button variant="contained" type="submit">Begin Meeting</Button>}
                {isPending && <button disabled type="submit">Generating Meeting</button>}
            </form>}
            {isActive && <Timer minutes={meetingInfo.duration}></Timer>}
            {isActive && <button onClick={cancel}>Cancel Meeting</button>}
        </div>

    )
}