import { AbstractObject } from './abstract-object'

export class Background extends AbstractObject {
  onUpdate(): void {
    this.game.clear('#195938')
  }
}
