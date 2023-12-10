import { Ball } from './objects/ball'
import { Game } from './game'
import { Background } from './objects/background'
import './style.css'
import { generateRandomColor } from './utils'

const game = new Game('#game')
game.add(Background)
game.run()

game.canvas.addEventListener('mouseup', (e) => {
  const rect = game.canvas.getBoundingClientRect()
  const radius = Math.random() * 20 + 10
  const color = generateRandomColor(100)

  game.add(Ball, {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    radius: radius,
    restitution: 0.7,
    mass: radius,
    color: color,
  })
})
