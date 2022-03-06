import React, { useState } from 'react';
export default function CreateMeeting() {
    const [meetingInfo, setInfo] = useState({
        code: "",
        duration: ""
    })
    const [isPending, setPending] = useState(false);
    function submit(e) {
        e.preventDefault();
        setPending(true);
        const data = {
            code: meetingInfo.code,
            duration: meetingInfo.duration
        }
        console.log(data);
        fetch('http://localhost:5000/meeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.log('Error:', error);
            })
    }
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
            <form onSubmit={(e) => submit(e)}>
                <input onChange={(e) => handle(e)} id="code" placeholder="Enter meeting code" type="text"></input>
                <input onChange={(e) => handle(e)} id="duration" placeholder="Enter meeting duration" type="number"></input>
                {!isPending && <button type="submit">Generate Meeting</button>}
                {isPending && <button disabled type="submit">Generating Meeting</button>}
            </form>
            {/* </  button> */}
        </div>
    )
}