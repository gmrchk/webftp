import React, { Component } from 'react';
import download from '../../icons/download-blue.svg';
import upload from '../../icons/upload-blue.svg';
//import upload from '../../icons/upload-orange.svg';
import Empty from '../Empty/index';

export default class Queue extends Component {
    compare(a,b) {
        if (a.priority < b.priority)
            return -1;
        if (a.priority > b.priority)
            return 1;
        return 0;
    }

    humanFileSize(bytes, si = true) {
        var thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = si
            ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
            : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    }

    render() {
        return (
            <div className="Queue">
                {this.props.queue.map(item => {
                    return (
                        <div key={item.path + item.size + item.remote} className={item.inProgress ? "QueueItem QueueItem--inProgress" : "QueueItem"} tabIndex="0" role="button" onClick={this.props.handleListItemClick}>
                            <div className="QueueItem-direction"><img data-tip={item.upload ? "Upload" : "Download"} data-effect="solid" src={item.upload ? upload : download} alt=""/></div>
                            <div className="QueueItem-name">{item.name}</div>
                            <div className="QueueItem-fromToFolder">
                                <div className="Tag Tag--orange" data-tip={item.fromFolder} data-effect="solid">From</div>
                                <div className="Tag Tag--blue" data-tip={item.toFolder} data-effect="solid">To</div>
                            </div>
                            <div className={"QueueItem-priority QueueItem-priority--" + item.priority} data-tip="Priority" data-effect="solid">{item.priority}</div>
                            <div className="QueueItem-transfered" data-tip={item.transfered ? this.humanFileSize(item.transfered) : 0} data-effect="solid">{item.transfered ? this.humanFileSize(item.transfered) : 0}</div>
                            <div className="QueueItem-size" data-tip={this.humanFileSize(item.size)} data-effect="solid">{this.humanFileSize(item.size)}</div>
                            <div className="QueueItem-progress">
                                <progress data-tip={item.progress*100 + " %"} data-effect="solid" value={item.progress*100} max="100"></progress>
                            </div>
                            <div className="QueueItem-actions">

                            </div>
                        </div>
                    )
                })}
                {!this.props.queue.length && (<Empty/>)}
            </div>
        );
    }
}
