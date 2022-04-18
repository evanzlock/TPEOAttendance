import React, { useState, useEffect } from 'react';
import configData from "../configurl.json";
import Timer from "./Timer";
import { Form, Row, Button } from "react-bootstrap";
import './CreateMeeting.css'
var url = configData.URL;

export default function CreateMeeting(props) {
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
            .then(response => response.json())
            .then(data => {
                console.log('DATA');
                console.log(data);
                console.log(data.activeMeeting);
                setMeetingNumber(data.data.number);
                setActive(data.data.activeMeeting);
                setInfo({
                    code: meetingInfo.code,
                    type: props.type,
                    startTime: meetingInfo.startTime,
                    endTime: data.data.endTime,
                    tardyTime: meetingInfo.tardyTime
                })
                console.log(meetingNumber);
                console.log(isActive);
                if (isActive) {
                    toggleInfo(!showInfo);
                }
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
                setActive(!isActive),
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
            type: props.type,
            startTime: meetingInfo.startTime,
            endTime: meetingInfo.endTime,
            tardyTime: meetingInfo.tardyTime
        }
        var input = e.target.value;
        var key = e.target.name;
        console.log(input)
        if (key === 'duration') {
            console.log(parseInt(input))
            newInfo['startTime'] = Date.now();
            newInfo['endTime'] = Date.now() + 60000 * parseInt(input);
            newInfo['tardyTime'] = Date.now() + 600000;
        }
        else {
            newInfo[key] = input;
        }
        setInfo(newInfo);
    }
    // TODO: change toggle so ending a meeting shows generate meeting
    return (
        <div className="meeting-container">
            {toggleInfo && <form onSubmit={(e) => submit(e)}>
                <Form>
                    <Row>
                        <div className="codeField">
                            <Form.Group as={Row}> <Form.Control class="form in-line"
                                style={{ backgroundColor: "#DADADA" }}
                                name="code"
                                placeholder='Meeting code'
                                type="number"
                                onChange={e => handle(e)}
                            /></Form.Group>
                        </div>
                        <div className="durationField">
                            <Form.Group as={Row}><Form.Control class="form in-line"
                                style={{ backgroundColor: "#DADADA" }}
                                name="duration"
                                placeholder='Meeting duration'
                                type="number"
                                onChange={e => handle(e)}
                            /></Form.Group>
                        </div>
                        {!isPending && <button className='button' variant="outline-light" style={{ color: "#00005c" }} onClick={e => submit(e)}>Start Meeting</button>
                        }
                        {isPending && <button className="button" disabled type="submit">Generating Meeting</button>}
                    </Row>
                </Form>
            </form>}
            {!toggleInfo && isActive &&
                <div className="flex-end">
                    <h2>There is a meeting in progress. </h2>
                    <Timer time={meetingInfo.endTime - Date.now()} color={props.color}></Timer>
                    <div className="buttons">
                        <Button variant="danger" onClick={cancel}>Cancel Meeting</Button>
                        <Button onClick={end}>End Meeting</Button>
                    </div>
                </div>}
            {/* {!toggleInfo && isActive && <h1>There is a meeting in progress.</h1>}
            {!toggleInfo && isActive && meetingInfo.endTime > 0 && meetingInfo.endTime > Date.now() && <Timer time={meetingInfo.endTime - Date.now()} color={props.color}></Timer>}
            {/* {isActive && <Timer minutes={meetingInfo.duration}></Timer>} */}
            {/* {isActive && <Button variant="danger" onClick={cancel}>Cancel Meeting</Button>}
            {isActive && <Button onClick={end}>End Meeting</Button>} */}
        </div>

    )
}