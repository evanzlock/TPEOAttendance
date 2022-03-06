import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const membersEl = document.querySelector('#members')

    const getMembers = async () => {
        const res = await fetch('http://localhost:5000/members')
        const data = await res.json()
        return data
    }
    const getForms = async () => {
        const res = await fetch('http://localhost:5000/forms')
        const data = await res.json()
        return data
    }
    const addMembers = async () => {
        const members = await getMembers()
        members.forEach(member => {
            const div = document.createElement('div')
            div.className = 'member'
            div.innerHTML = `
            <h3>${member.name}</h3>
            <ul>
                <li>${member.team}</li>
                <li>Excused Meetings: ${member.excused}</li>
                <li>Unexcused Meetings: ${member.unexcused}</li>
                <li>Total Meetings Attended: ${member.total}</li>
            </ul>
        `
            membersEl.appendChild(div)
        })
    }
    function toggleMeeting() {
        var inputVal = document.getElementById('myInput').value;
        var seconds = inputVal * 60;
        var totalTime = seconds;
        $time = document.querySelector('#countdown');
        (function countdown() {
            var hours = Math.floor(seconds / 3600) <= 0 ? 0 : Math.floor(seconds / 360000)
            seconds -= 3600 * hours
            var minutes = Math.floor(seconds / 60) <= 0 ? 0 : Math.floor(seconds / 60)
            seconds -= 60 * minutes
            $seconds.textContent = hours.toString() + minutes.toString() + seconds.toString();
            if (totalTime-- > 0) setTimeout(countdown, 1000)
        })();
    }
    const calculateTimeLeft = () => {
        let time = document.getElementById('myInput').value;
        let timeLeft = {};
        if (time > 0) {
            timeLeft = {
                days: Math.floor(time / (1000 * 60 * 60 * 24)),
                hours: Math.floor((time / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((time / 1000 / 60) % 60),
                seconds: Math.floor((time / 1000) % 60)
            };
        }

        return timeLeft;
    }
}