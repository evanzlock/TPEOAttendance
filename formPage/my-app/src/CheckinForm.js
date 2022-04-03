import React from 'react';

async function getCheckin(state) {
    const request = await fetch("http://localhost:5000/updateCheckin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": state.name,
            "type": state.type,
            "code": state.code
        }),
      });
      // Get Status and Response
      const resp = await request.json();
      const msg = await resp.msg;
      return msg;
        
}


export default class CheckinForm extends React.Component {
    state = {
        name: '',
        type: 'General',
        code: ''
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

                    <input 
                    name = "code"
                    placeholder = 'Meeting Code' 
                    value = {this.state.code} 
                    onChange={e => this.change(e)} 
                    />
                    <br />
                    <button onClick={e => this.onSubmit(e)}>Submit</button>
                </div>
            </form>
           
        );
    }
}
