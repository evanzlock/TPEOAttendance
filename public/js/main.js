const membersEl = document.querySelector('#members')

function Random() {
    var rnd = Math.floor(Math.random() * 10000);
    document.getElementById('tb').value = rnd;
}
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

addMembers()