import { Game } from '../game'

export abstract class AbstractObject {
  private _shouldDestroy: boolean = false

  constructor(protected readonly game: Game) {}

  onInit(..._args: any[]): void {}
  onUpdate(): void {}

  destroy(): void {
    this._shouldDestroy = true
  }

  get shouldDestroy(): boolean {
    return this._shouldDestroy
  }
}
