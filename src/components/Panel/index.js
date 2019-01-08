import React, { Component } from 'react';

export default class Panel extends Component {
    render() {
        return (
            <div className={"Panel Panel--" + this.props.name}>
                {this.props.children}
            </div>
        );
    }
}
