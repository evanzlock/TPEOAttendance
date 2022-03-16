import React, { useState } from 'react';
import configData from "../config.json";
import Timer from "./Timer";
const URL = configData.DEV_URL;
console.log(URL);
export default function CreateMeeting() {
    const [meetingInfo, setInfo] = useState({
        code: "",
        duration: "",
        type: ""
    })
    const [isPending, setPending] = useState(false);
    const [isActive, setActive] = useState(false);
    //send code, duration, and type to backend for attendance verification
    function cancel() {
        fetch(`${URL}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.text())
            .then(text => console.log(text))
            .then(setActive(false));
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
                setPending(false)
                setActive(true);
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
    return (
        <div>
            {/* <button onClick="showDiv()" id="initialButton">Create Meeting */}
            <form onSubmit={(e) => submit(e)}>
                <input onChange={(e) => handle(e)} id="code" placeholder="Enter meeting code" type="text"></input>
                <input onChange={(e) => handle(e)} id="duration" placeholder="Enter meeting duration" type="number"></input>
                <select onChange={(e) => handle(e)} id="type" name="type">
                    <option value="" selected disabled hidden>Choose a Meeting Type</option>
                    <option value="general">General</option>
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="product">Product</option>
                </select>
                {!isPending && <button type="submit">Generate Meeting</button>}
                {isPending && <button disabled type="submit">Generating Meeting</button>}
                {isActive && <Timer minutes={meetingInfo.duration}></Timer>}
            </form>
            {/* </  button> */}
            {/* {isActive && <button onClick={cancel()}>Cancel Meeting</button>} */}
        </div>

    )
}