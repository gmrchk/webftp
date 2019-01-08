import React, { Component } from 'react';

export default class Files extends Component {
    componentDidMount() {
        this.refs.container.scrollTop = this.refs.container.scrollHeight;
    }

    componentDidUpdate() {
        this.refs.container.scrollTop = this.refs.container.scrollHeight;
    }

    render() {
        return (
            <div className="Log" ref="container">
                {this.props.log.map(item => {
                    let className = "LogItem";
                    if(item.type === "warning") {
                        className += " LogItem--warning";
                    }
                    if(item.type === "error") {
                        className += " LogItem--error";
                    }
                    if(item.type === "info") {
                        className += " LogItem--info";
                    }
                    return (
                        <div key={item.id} className={className}>{item.text}</div>
                    )
                })}
            </div>
        );
    }
}
