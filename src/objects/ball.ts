import { Vector2 } from '../vector2'
import { AbstractObject } from './abstract-object'

export const BALL_FRICTION = 0.008
export const BALL_SPEED = 5
export const BALL_DENSITY = 1.22
export const BALL_ACCELERATION = 9.81
export const BALL_DRAG = 0.47
export const BALL_GRAVITY = 2

export interface BallOptions {
  x: number
  y: number
  radius: number
  restitution: number
  mass: number
  image: string
  velocity: Vector2
}

export class Ball extends AbstractObject {
  private position: Vector2 = new Vector2()
  private velocity: Vector2 = new Vector2()
  private radius = 0
  private mass = 0
  private restitution = 0
  private area = 0
  private rotation = 0
  private image = ''

  onInit(options: BallOptions) {
    this.position.x = options.x
    this.position.y = options.y
    this.velocity = options.velocity
    this.mass = options.mass
    this.radius = options.radius
    this.restitution = -options.restitution
    this.area = (Math.PI * this.radius ** 2) / 10000
    this.image = options.image
  }

  isHittingWall(): boolean {
    return (
      this.position.x + this.radius >= this.game.width ||
      this.position.x - this.radius <= 0 ||
      this.position.y + this.radius >= this.game.height ||
      this.position.y - this.radius <= 0
    )
  }

  isColliding(x: number, y: number, radius: number): boolean {
    return (
      Math.hypot(x - this.position.x, y - this.position.y) <
      this.radius + radius
    )
  }

  handleCircleCollisions() {
    for (const other of this.game.objects) {
      if (this === other || !(other instanceof Ball)) {
        continue
      }

      const distance = this.position.sub(other.position).magnitute()
      if (distance > this.radius + other.radius) {
        continue
      }

      const nx = (other.position.x - this.position.x) / distance
      const ny = (other.position.y - this.position.y) / distance

      const p =
        (2 *
          (this.velocity.x * nx +
            this.velocity.y * ny -
            other.velocity.x * nx -
            other.velocity.y * ny)) /
        (this.mass + other.mass)

      // Calculate collision point
      const cx =
        (this.position.x * other.radius + other.position.x * this.radius) /
        (this.radius + other.radius)
      const cy =
        (this.position.y * other.radius + other.position.y * this.radius) /
        (this.radius + other.radius)

      // Prevent overlap
      this.position.x =
        cx + (this.radius * (this.position.x - other.position.x)) / distance
      this.position.y =
        cy + (this.radius * (this.position.y - other.position.y)) / distance
      other.position.x =
        cx + (other.radius * (other.position.x - this.position.x)) / distance
      other.position.y =
        cy + (other.radius * (other.position.y - this.position.y)) / distance

      // Update velocity
      this.velocity.x -= p * this.mass * nx
      this.velocity.y -= p * this.mass * ny
      other.velocity.x += p * other.mass * nx
      other.velocity.y += p * other.mass * ny
    }
  }

  handleWallCollision() {
    if (this.position.x > this.game.width - this.radius) {
      this.velocity.x *= this.restitution
      this.position.x = this.game.width - this.radius
    } else if (this.position.x < this.radius) {
      this.velocity.x *= this.restitution
      this.position.x = this.radius
    }

    if (this.position.y > this.game.height - this.radius) {
      this.velocity.y *= this.restitution
      this.position.y = this.game.height - this.radius
    } else if (this.position.y < this.radius) {
      this.velocity.y *= this.restitution
      this.position.y = this.radius
    }
  }

  handleGravity(deltaTime: number) {
    const f = -0.5 * BALL_DRAG * BALL_DENSITY * this.area
    let fx =
      f * this.velocity.x ** 2 * (this.velocity.x / Math.abs(this.velocity.x))
    let fy =
      f * this.velocity.y ** 2 * (this.velocity.y / Math.abs(this.velocity.y))

    if (isNaN(fx)) {
      fx = 0
    }

    if (isNaN(fy)) {
      fy = 0
    }

    const ax = fx / this.mass
    const ay = BALL_ACCELERATION * BALL_GRAVITY + fy / this.mass

    this.velocity.x += ax * deltaTime
    this.velocity.y += ay * deltaTime
    this.position.x += this.velocity.x * deltaTime * 4
    this.position.y += this.velocity.y * deltaTime * 4

    // add friction to ball velocity x
    this.velocity.x -= this.velocity.x * BALL_FRICTION
    this.rotation += this.velocity.x * deltaTime * 4
  }

  onUpdate(deltaTime: number): void {
    for (let sub = 0; sub < 5; ++sub) {
      this.handleGravity(deltaTime)
      this.handleWallCollision()
      this.handleCircleCollisions()
    }

    this.game.ctx.save()
    this.game.ctx.translate(this.position.x, this.position.y)
    this.game.ctx.rotate((this.rotation * Math.PI) / 180)
    this.game.ctx.drawImage(
      this.game.assets.get(this.image)!,
      -this.radius,
      -this.radius,
      this.radius * 2 - 2,
      this.radius * 2 - 2,
    )
    this.game.ctx.restore()
  }
}
