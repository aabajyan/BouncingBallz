import { AbstractObject } from './abstract-object'

export class Temp extends AbstractObject {
  onUpdate(): void {
    this.game.clear('black')
  }
}
