import React, { Component } from 'react';

import transfer from '../../icons/transfer.svg';
import transferWhite from '../../icons/transfer-white.svg';
import edit from '../../icons/edit.svg';
import editWhite from '../../icons/edit-white.svg';
import settings from '../../icons/settings.svg';
import settingsWhite from '../../icons/settings-white.svg';

export default class Menu extends Component {
    render() {
        return (
            <div className="Menu">
                <div onClick={this.props.handleMenuItemClick} data-panel="transfer" data-tip="Transfers" data-place="right" data-effect="solid" className={this.props.activePanel === "transfer" ? "MenuItem MenuItem--active" : "MenuItem"} tabIndex="0" role="button">
                    <div className="MenuItem-icon">
                        <img src={this.props.activePanel === "transfer" ? transferWhite : transfer} alt=""/>
                    </div>
                    {/*<div className="MenuItem-name">FTP</div>*/}
                </div>
                <div onClick={this.props.handleMenuItemClick} data-panel="edit" data-tip="Edit list" data-place="right" data-effect="solid" className={this.props.activePanel === "edit" ? "MenuItem MenuItem--active" : "MenuItem"} tabIndex="0" role="button">
                    <div className="MenuItem-icon">
                        <img src={this.props.activePanel === "edit" ? editWhite : edit} alt=""/>
                    </div>
                </div>
                <div onClick={this.props.handleMenuItemClick} data-panel="settings" data-tip="Settings" data-place="right" data-effect="solid" className={this.props.activePanel === "settings" ? "MenuItem MenuItem--active" : "MenuItem"} tabIndex="0" role="button">
                    <div className="MenuItem-icon">
                        <img src={this.props.activePanel === "settings" ? settingsWhite : settings} alt=""/>
                    </div>
                </div>
            </div>
        );
    }
}
