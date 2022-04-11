import React from 'react';
import {Card, Button, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './form.css';
import configData from "../configurl.json";
var URL = configData.DEV_URL;


async function getCheckin(state) {
    const request = await fetch(`${URL}/submitExcusedAbsence`, {
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
        <div>
        <h1>Excused Absence Form</h1>
        <Card border = "dark">
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

                    <div className = "absenceField">
                    <Form.Control as="textarea"
                    style={{backgroundColor: "#DADADA"}}
                    name = "reason"
                    placeholder = 'Reason for Absence' 
                    value = {this.state.reason} 
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
