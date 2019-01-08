import React, { Component } from 'react';
import box from '../../icons/box.svg';

export default class Empty extends Component {
    render() {
        return (
            <div className="Empty"><div className="Empty-inner"><img src={box} alt=""/>Empty</div></div>
        );
    }
}
