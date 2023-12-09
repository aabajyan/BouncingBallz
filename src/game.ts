import { AbstractObject } from './objects/abstract-object'

export class Game {
  public readonly width: number
  public readonly height: number
  public readonly canvas: HTMLCanvasElement
  public readonly ctx: CanvasRenderingContext2D

  private objects: AbstractObject[] = []
  private isRunning = false

  constructor(canvas: string) {
    const el = document.querySelector(canvas)
    if (!(el instanceof HTMLCanvasElement)) {
      throw new Error('Canvas not found')
    }

    const ctx = el.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas context not found')
    }

    this.width = el.width
    this.height = el.height
    this.canvas = el
    this.ctx = ctx
  }

  clear(color: string = 'black'): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  circle(x: number, y: number, radius: number, color: string): void {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.closePath()
  }

  add<T extends AbstractObject>(
    object: new (game: Game) => T,
    ...props: Parameters<T['onInit']>
  ): T {
    const obj = new object(this)
    obj.onInit(...props)
    this.objects.push(obj)

    return obj
  }

  private loop() {
    if (this.isRunning) {
      requestAnimationFrame(this.loop.bind(this))
    }

    this.objects = this.objects.filter((object) => {
      if (object.shouldDestroy) {
        return false
      }

      object.onUpdate()
      return true
    })
  }

  stop(): void {
    this.isRunning = false
  }

  run(): void {
    this.isRunning = true
    this.loop()
  }
}
