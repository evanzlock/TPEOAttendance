import React from "react";
import CreateMeeting from "./CreateMeeting";

export default function General(props) {
    return (
        <div className="contact">
            <div class="container">
                <CreateMeeting meetingType={props.meetingType}></CreateMeeting>
            </div>
        </div>
    );
}
