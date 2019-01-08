import React, { Component } from 'react';

export default class Header extends Component {
    render() {
        return (
            <div>
                <div className="AppHeader-buttons">
                    <button className="AppHeader-button AppHeader-button--close" onClick={this.closeHandler}></button>
                    <button className="AppHeader-button AppHeader-button--maximize" onClick={this.maximizeHandler}></button>
                    <button className="AppHeader-button AppHeader-button--minimize" onClick={this.minimizeHandler}></button>
                </div>
            </div>
        );
    }
}
