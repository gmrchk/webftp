import React, { Component } from 'react';
import check from '../../icons/check-blue.svg';
import loading from '../../icons/loading-orange.svg';

export default class Status extends Component {
    texts = {
        idle: "All good",
        loading: "Updating",
        transfer: "Transfering",
    }

    render() {
        let icon = this.props.status === "idle" ? check : loading;
        let className = this.props.status === "idle" ? "Status Status--idle" : "Status Status--loading";
        let text = this.texts[this.props.status];

        return (
            <div className={className}>
                <div className="Status-icon"><img src={icon} alt=""/></div>
                {text}
            </div>
        );
    }
}
