import { Game } from '../game'

export abstract class AbstractObject {
  constructor(protected readonly game: Game) {}

  onInit(..._args: any[]): void {}

  onUpdate(_delta: number): void {}

  destroy(): void {
    this.game.destroy(this)
  }
}
