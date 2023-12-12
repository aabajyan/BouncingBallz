export class Vector2 {
  constructor(
    public x = 0,
    public y = 0,
  ) {}

  public add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  public sub(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y)
  }

  public magnitute(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
}
