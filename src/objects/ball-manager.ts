import { Vector2 } from '../vector2'
import { AbstractObject } from './abstract-object'
import { Ball } from './ball'

export const BALL_MANAGER_RADIUS = 30

const images = ['ball_black', 'ball_red', 'ball_white', 'ball_yellow']

enum SpawningBallStatus {
  NOT_SPAWNING = 0,
  START_SPAWNING = 1,
  SPAWNED = 2,
}

export class BallManager extends AbstractObject {
  private status: SpawningBallStatus = SpawningBallStatus.NOT_SPAWNING
  private x: number = 0
  private y: number = 0
  private image: string = ''
  private mousePosition: Vector2 = new Vector2()

  onInit(): void {
    this.game.canvas.addEventListener('mousedown', () => this.onMouseDown())

    window.addEventListener('mouseup', () => this.onMouseUp())
    window.addEventListener('mousemove', (e) => this.onMouseMove(e))
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

  onMouseMove(e: MouseEvent): void {
    const rect = this.game.canvas.getBoundingClientRect()
    this.mousePosition.x = e.clientX - rect.left
    this.mousePosition.y = e.clientY - rect.top
  }

  onMouseDown(): void {
    if (this.status !== SpawningBallStatus.NOT_SPAWNING) {
      return
    }

    if (!this.isSpaceAvaliable(this.mousePosition.x, this.mousePosition.y)) {
      return
    }

    this.status = SpawningBallStatus.START_SPAWNING
    this.x = this.mousePosition.x
    this.y = this.mousePosition.y
    this.image = images[Math.floor(Math.random() * images.length)]
  }

  onMouseUp(): void {
    if (this.status === SpawningBallStatus.NOT_SPAWNING) {
      return
    }

    this.status = SpawningBallStatus.SPAWNED
  }

  onUpdate(): void {
    this.game.clear('#195938')

    if (this.status !== SpawningBallStatus.NOT_SPAWNING) {
      this.game.ctx.drawImage(
        this.game.assets.get(this.image)!,
        -BALL_MANAGER_RADIUS + this.x,
        -BALL_MANAGER_RADIUS + this.y,
        BALL_MANAGER_RADIUS * 2 - 2,
        BALL_MANAGER_RADIUS * 2 - 2,
      )
      this.game.line(
        this.mousePosition.x,
        this.mousePosition.y,
        this.x,
        this.y,
        'red',
        2,
      )

      if (this.status === SpawningBallStatus.SPAWNED) {
        this.game.add(Ball, {
          x: this.x,
          y: this.y,
          image: this.image,
          radius: BALL_MANAGER_RADIUS,
          restitution: 0.5,
          mass: BALL_MANAGER_RADIUS,
          velocity: new Vector2(
            this.x - this.mousePosition.x,
            this.y - this.mousePosition.y,
          ),
        })
        this.status = SpawningBallStatus.NOT_SPAWNING
      }
    }
  }
}
