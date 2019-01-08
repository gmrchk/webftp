import React, { Component } from 'react';
import play from '../../icons/play.svg';
import pause from '../../icons/pause.svg';

export default class Actions extends Component {
    render() {
        return (
            <div className="Actions">
                <div data-panel="transfer" data-tip="Play/Pause" data-place="right" data-effect="solid" className="ActionsItem" tabIndex="0" role="button" onClick={this.props.toggleQueueStatus}>
                    {this.props.queueStatus === "paused" && <img src={pause} alt=""/>}
                    {this.props.queueStatus === "played" && <img src={play} alt=""/>}
                </div>
            </div>
        );
    }
}
