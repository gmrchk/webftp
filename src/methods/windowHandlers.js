export const minimizeHandler = event => {
    const { BrowserWindow } = window.require('electron').remote;
    const win = BrowserWindow.getFocusedWindow();
    win.minimize();
}

export const maximizeHandler = event => {
    const { BrowserWindow } = window.require('electron').remote;
    const win = BrowserWindow.getFocusedWindow();
    win.maximize();
}

export const closeHandler = event => {
    const { BrowserWindow } = window.require('electron').remote;
    const win = BrowserWindow.getFocusedWindow();
    win.close();
}

export function handleMenuItemClick(event) {
    this.setState({
        activePanel: event.target.dataset.panel,
    });
}

export function log(item) {
    item.id = Math.random();
    this.setState({
        log: [ ...this.state.log, item]
    });
}