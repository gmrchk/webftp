export function saveSettings(newSettings) {

    let settings = {
        ...this.state.settings,
        ...newSettings,
    }

    window.localStorage.setItem("settings", JSON.stringify(settings));

    this.setState({
        settings: settings,
    });
}

export function getSettings() {
    let newSettings = JSON.parse(window.localStorage.getItem("settings"));

    return {
        ...this.state.settings,
        ...newSettings,
    }
}
