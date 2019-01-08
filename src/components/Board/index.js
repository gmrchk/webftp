import React, { Component } from 'react';
import { Form, Text, Checkbox } from 'informed';

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.setFormApi = this.setFormApi.bind(this);
    }

    handleSaveClick(event) {
        event.preventDefault();
        let savedValues = {
            ...this.props.board,
            ...this.formApi.getState().values,
            boardActive: true,
        }
        this.props.saveHandler(savedValues);
    }

    handleDeleteClick() {
        this.props.deleteHandler(this.props.board.id);
    }

    setFormApi(formApi){
        this.formApi = formApi;
    }

    render() {
        return (
            <div className="Board" key={Math.random()}>
                {this.props.board && this.props.board.name !== null &&
                    <Form className="Form" getApi={this.setFormApi}>
                        <div className="Input">
                            <label>Name:</label>
                            <Text field="name" initialValue={String(this.props.board.name)} key={Math.random()} disabled={this.props.board.type === "shared"}/>
                        </div>
                        <div className="Input">
                            <label>Host:</label>
                            <Text field="host" initialValue={String(this.props.board.host)} disabled={this.props.board.type === "shared"}/>
                        </div>
                        <div className="Input">
                            <label>User:</label>
                            <Text field="user" initialValue={String(this.props.board.user)} disabled={this.props.board.type === "shared"}/>
                        </div>
                        <div className="Input">
                            <label>Password:</label>
                            <Text field="pass" initialValue={this.props.board.user !== null && this.props.board.user !== "" ? "•••••••" : "" } disabled={this.props.board.type === "shared"}/>
                        </div>
                        <div className="Input">
                            <label>Port:</label>
                            <Text field="port" initialValue={String(this.props.board.port)} disabled={this.props.board.type === "shared"}/>
                        </div>
                        <div className="Input">
                            <label>Owner:</label>
                            <Text field="owner" initialValue={this.props.board.owner ? String(this.props.board.owner) : "You"} disabled={true}/>
                        </div>
                        <div className="Checkbox">
                            <label>
                                <Checkbox field="ssl" initialValue={this.props.board.ssl} disabled={this.props.board.type === "shared"} /> SSL
                            </label>
                        </div>
                        <div className="FormActions">
                            <button className="Button Button--blue" type="submit" onClick={this.handleSaveClick} disabled={this.props.board.type === "shared"}>Save</button>
                            {this.props.board.id !== -1 &&
                                <button className="Button Button--red" onClick={this.handleDeleteClick} disabled={this.props.board.type === "shared"}>Delete</button>
                            }
                        </div>
                    </Form>
                }
            </div>
        );
    }
}
