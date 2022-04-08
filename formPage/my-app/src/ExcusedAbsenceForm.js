import React from 'react';

async function getCheckin(state) {
    const request = await fetch("http://localhost:5000/submitExcusedAbsence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": state.name,
            "type": state.type,
            "reason": state.reason
        }),
      });
      // Get Status and Response
      const resp = await request.json();
      const msg = await resp.msg;
      return msg;
        
}


export default class ExcusedAbsenceForm extends React.Component {
    state = {
        name: '',
        type: 'General',
        reason: ''
    };

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    
    onSubmit = e => {
        e.preventDefault();
        getCheckin(this.state).then(res => alert(res));
    };

    render() {
        return (
            <form>
                <div>
                    <input 
                    name = "name"
                    placeholder = 'Name' 
                    value = {this.state.name} 
                    onChange={e => this.change(e)} 
                    />
                    <br />
                    <select 
                        name = "type"
                        value = {this.state.type}
                        onChange={e => this.change(e)}> 
                        <option value = "General">General</option>
                        <option value = "Engineering">Engineering</option>
                        <option value = "Product">Product</option>
                        <option value = "Design">Design</option>
                    </select>
                    <br />

                    <textarea 
                    name = "reason"
                    placeholder = 'Reason for Absence' 
                    value = {this.state.reason} 
                    onChange={e => this.change(e)} 
                    />
                    <br />
                    <button onClick={e => this.onSubmit(e)}>Submit</button>
                </div>
            </form>
           
        );
    }
}
