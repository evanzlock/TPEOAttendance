import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import PostData from './PostData';
export default function CreateMeeting() {
    const url = "https://localhost:3000/api";
    const [meetingInfo, setInfo] = useState({
        code: "",
        duration: ""
    })
    // function submit(e) {
    //     e.preventDefault();
    //     Axios.post(url, {
    //         code: meetingInfo.code,
    //         duration: parseInt(meetingInfo.duration)
    //     })
    //         .then(res => {
    //             console.log(res.data);
    //         })
    // }
    function handle(e) {
        const newInfo = {
            code: meetingInfo.code,
            duration: meetingInfo.duration
        };
        newInfo[e.target.id] = e.target.value;
        setInfo(newInfo);
    }
    return (
        <div>
            {/* <button onClick="showDiv()" id="initialButton">Create Meeting */}
            <form onSubmit={(e) => PostData(e)}>
                <input onChange={(e) => handle(e)} id="code" placeholder="Enter meeting code" type="text"></input>
                <input onChange={(e) => handle(e)} id="duration" placeholder="Enter meeting duration" type="number"></input>
                <button type="submit">Generate Meeting</button>
            </form>
            {/* </  button> */}
        </div>
    )
}