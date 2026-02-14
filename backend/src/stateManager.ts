import { VersionState } from './types'

class StateManager {
  private history: VersionState[] = []
  private currentVersion: number = 0

  store(version: VersionState): void {
    this.history.push(version)
    this.currentVersion = version.version
  }

  getCurrent(): VersionState | null {
    return this.history[this.history.length - 1] || null
  }

  getVersion(versionNumber: number): VersionState | null {
    return this.history.find(v => v.version === versionNumber) || null
  }

  getAllVersions(): VersionState[] {
    return [...this.history]
  }

  rollback(): VersionState | null {
    if (this.history.length <= 1) {
      return null
    }
    this.history.pop()
    const previous = this.history[this.history.length - 1]
    this.currentVersion = previous.version
    return previous
  }

  getNextVersionNumber(): number {
    return this.currentVersion + 1
  }

  clear(): void {
    this.history = []
    this.currentVersion = 0
  }
}

export const stateManager = new StateManager()
