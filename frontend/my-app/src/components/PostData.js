import { useEffect } from 'react'

export default function PostData(props) {
    const formInfo = {
        code: props.code,
        duration: props.duration
    }
    useEffect(() => {
        fetch("/meeting", {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify(formInfo)
        })
            .then(res => res.json())
            .then(data => console.log(data))
    })
}