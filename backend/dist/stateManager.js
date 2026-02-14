class StateManager {
    history = [];
    currentVersion = 0;
    store(version) {
        this.history.push(version);
        this.currentVersion = version.version;
    }
    getCurrent() {
        return this.history[this.history.length - 1] || null;
    }
    getVersion(versionNumber) {
        return this.history.find(v => v.version === versionNumber) || null;
    }
    getAllVersions() {
        return [...this.history];
    }
    rollback() {
        if (this.history.length <= 1) {
            return null;
        }
        this.history.pop();
        const previous = this.history[this.history.length - 1];
        this.currentVersion = previous.version;
        return previous;
    }
    getNextVersionNumber() {
        return this.currentVersion + 1;
    }
    clear() {
        this.history = [];
        this.currentVersion = 0;
    }
}
export const stateManager = new StateManager();
