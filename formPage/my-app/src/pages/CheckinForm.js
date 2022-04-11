import React from 'react';
import {Card, Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './form.css';

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
        <div>
        <h1>Member Check-in Form</h1>
        <Card border="dark">
            <Card.Body align = "center">
            <Form>
                <Form.Group>
                <div>
                    <div className = "nameField">
                    <Form.Control 
                    style={{backgroundColor: "#DADADA"}}
                    name = "name"
                    placeholder = 'Name' 
                    value = {this.state.name} 
                    onChange={e => this.change(e)} 
                    />
                    </div>
                    
                    <div className = "meetingTypeField">
                    <Form.Select 
                        style={{backgroundColor: "#DADADA"}}
                        name = "type"
                        value = {this.state.type}
                        onChange={e => this.change(e)}> 
                        <option value = "General">General</option>
                        <option value = "Engineering">Engineering</option>
                        <option value = "Product">Product</option>
                        <option value = "Design">Design</option>
                    </Form.Select>
                    </div>

                    <div className = "codeField">
                    <Form.Control 
                    style={{backgroundColor: "#DADADA"}}
                    name = "code"
                    placeholder = 'Meeting Code' 
                    value = {this.state.code} 
                    onChange={e => this.change(e)} 
                    />
                    </div>

                    <Button className = 'button' size="lg" variant="outline-light" style={{ color:"#00005c"}} onClick={e => this.onSubmit(e)}>Submit</Button>
                    
                </div>
            </Form.Group>
            </Form>
            </Card.Body>
        </Card>
        </div>
           
        );
    }
}
