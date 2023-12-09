import { Ball } from './objects/ball'
import { Game } from './game'
import './style.css'
import { Temp } from './objects/temp'

const game = new Game('#game')
game.add(Temp)
game.run()

window.addEventListener('mouseup', (e) => {
  const rect = game.canvas.getBoundingClientRect()
  game.add(Ball, e.clientX - rect.left, e.clientY - rect.top)
})
