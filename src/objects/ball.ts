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
}

export class Ball extends AbstractObject {
  private position: Vector2 = { x: 0, y: 0 }
  private velocity: Vector2 = { x: 0, y: 0 }
  private radius = 0
  private mass = 0
  private restitution = 0
  private area = 0
  private rotation = 0
  private rotationDirection = 0
  private image = ''

  onInit(options: BallOptions) {
    this.position.x = options.x
    this.position.y = options.y
    this.mass = options.mass
    this.radius = options.radius
    this.restitution = -options.restitution
    this.area = (Math.PI * this.radius ** 2) / 10000
    this.image = options.image

    setTimeout(this.destroy.bind(this), 100000)
  }

  isHittingWall(): boolean {
    return (
      this.position.x + this.radius >= this.game.width ||
      this.position.x - this.radius <= 0 ||
      this.position.y + this.radius >= this.game.height ||
      this.position.y - this.radius <= 0
    )
  }

  handleCircleCollisions() {
    for (const other of this.game.objects) {
      if (this === other || !(other instanceof Ball)) {
        continue
      }

      // d = sqrt((x2-x1)^2 + (y2-y1)^2)
      const distance = Math.sqrt(
        (this.position.x - other.position.x) ** 2 +
          (this.position.y - other.position.y) ** 2,
      )

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
      this.rotationDirection = Math.sign(this.velocity.x)
      other.velocity.x += p * other.mass * nx
      other.velocity.y += p * other.mass * ny
      other.rotationDirection = Math.sign(other.velocity.x)
    }
  }

  handleWallCollision() {
    if (this.position.x > this.game.width - this.radius) {
      this.velocity.x *= this.restitution
      this.position.x = this.game.width - this.radius
      this.rotationDirection = -Math.sign(this.velocity.x)
    } else if (this.position.x < this.radius) {
      this.velocity.x *= this.restitution
      this.position.x = this.radius
      this.rotationDirection = Math.sign(this.velocity.x)
    }

    if (this.position.y > this.game.height - this.radius) {
      this.velocity.y *= this.restitution
      this.position.y = this.game.height - this.radius
    } else if (this.position.y < this.radius) {
      this.velocity.y *= this.restitution
      this.position.y = this.radius
    }
  }
  onUpdate(deltaTime: number): void {
    this.handleWallCollision()
    this.handleCircleCollisions()

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
    this.position.x += this.velocity.x * deltaTime * 100
    this.position.y += this.velocity.y * deltaTime * 100
    this.rotation += this.rotationDirection * Math.abs(this.velocity.x) * 20

    // add friction to ball velocity x
    this.velocity.x -= this.velocity.x * BALL_FRICTION

    this.game.ctx.save()
    this.game.ctx.translate(this.position.x, this.position.y)
    this.game.ctx.rotate((this.rotation * Math.PI) / 180)
    this.game.ctx.drawImage(
      this.game.assets.get(this.image)!,
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2,
    )
    this.game.ctx.restore()
  }
}
