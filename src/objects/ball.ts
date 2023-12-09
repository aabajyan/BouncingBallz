import { AbstractObject } from './abstract-object'

export const BALL_SPEED = 5
export const BALL_RADIUS = 20

export class Ball extends AbstractObject {
  private x = 0
  private y = 0
  private xDirection = 1
  private yDirection = 1

  onInit(x: number, y: number) {
    this.x = x
    this.y = y
  }

  onUpdate(): void {
    this.x += BALL_SPEED * this.xDirection
    this.y += BALL_SPEED * this.yDirection

    if (this.x >= this.game.width - BALL_RADIUS || this.x <= BALL_RADIUS) {
      this.xDirection = -this.xDirection
    }

    if (this.y >= this.game.height - BALL_RADIUS || this.y <= BALL_RADIUS) {
      this.yDirection = -this.yDirection
    }

    this.game.circle(this.x, this.y, BALL_RADIUS, 'white')
  }
}
