import { AbstractObject } from './abstract-object'
import { Ball } from './ball'

export const BALL_MANAGER_RADIUS = 30

const images = ['ball_black', 'ball_red', 'ball_white', 'ball_yellow']

export class BallManager extends AbstractObject {
  onInit(): void {
    this.game.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e))
  }

  private isSpaceAvaliable(x: number, y: number): boolean {
    for (const object of this.game.objects) {
      if (!(object instanceof Ball)) {
        continue
      }

      if (object.isColliding(x, y, BALL_MANAGER_RADIUS)) {
        return false
      }
    }

    return true
  }

  onMouseUp(e: MouseEvent): void {
    const rect = this.game.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (!this.isSpaceAvaliable(x, y)) {
      return
    }

    this.game.add(Ball, {
      x: x,
      y: y,
      radius: BALL_MANAGER_RADIUS,
      restitution: 0.5,
      mass: BALL_MANAGER_RADIUS,
      image: images[Math.floor(Math.random() * images.length)],
    })
  }

  onUpdate(): void {
    this.game.clear('#195938')
  }
}
