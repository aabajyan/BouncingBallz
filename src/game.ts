import { AssetLoader } from './assets'
import { AbstractObject } from './objects/abstract-object'

export class Game {
  public readonly width: number
  public readonly height: number
  public readonly canvas: HTMLCanvasElement
  public readonly ctx: CanvasRenderingContext2D
  public readonly assets: AssetLoader = new AssetLoader()

  public objects: AbstractObject[] = []
  private objectsToAdd: AbstractObject[] = []
  private objectsToRemove: AbstractObject[] = []

  private _isRunning = false
  private _lastTime = 0

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
    this.ctx.imageSmoothingEnabled = false
  }

  clear(color: string = 'black'): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    stroke: number = 1,
  ): void {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = stroke
    this.ctx.stroke()
    this.ctx.closePath()
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
    this.objectsToAdd.push(obj)

    return obj
  }

  destroy(object: AbstractObject): void {
    this.objectsToRemove.push(object)
  }

  private loop(now: number) {
    const deltatime = (now - this._lastTime) / 1000
    for (let i = 0; i < this.objects.length; ++i) {
      this.objects[i].onUpdate(deltatime)
    }

    if (this.objectsToRemove.length > 0) {
      this.objects = this.objects.filter(
        (obj) => !this.objectsToRemove.includes(obj),
      )
      this.objectsToRemove = []
    }

    if (this.objectsToAdd.length > 0) {
      this.objects = this.objects.concat(this.objectsToAdd)
      this.objectsToAdd = []
    }

    this._lastTime = now
    if (this._isRunning) {
      requestAnimationFrame(this.loop.bind(this))
    }
  }

  private assetLoadLoop() {
    if (this.assets.isReady) {
      this._isRunning = true
      requestAnimationFrame(this.loop.bind(this))
      return
    }

    setTimeout(this.assetLoadLoop.bind(this), 100)
  }

  pause(): void {
    this._isRunning = false
  }

  resume(): void {
    this._lastTime = performance.now()
    this._isRunning = true
    requestAnimationFrame(this.loop.bind(this))
  }

  run(): void {
    if (this._isRunning) {
      return
    }

    this.assetLoadLoop()
  }

  get isRunning(): boolean {
    return this._isRunning
  }
}
