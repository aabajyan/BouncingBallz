import { Ball } from './objects/ball'
import { Game } from './game'
import { Background } from './objects/background'
import './style.css'

const game = new Game('#game')

const images = ['ball_black', 'ball_red', 'ball_white', 'ball_yellow']
game.assets.add('ball_black', '/spr_ball_black.png')
game.assets.add('ball_red', '/spr_ball_red.png')
game.assets.add('ball_white', '/spr_ball_white.png')
game.assets.add('ball_yellow', '/spr_ball_yellow.png')

game.add(Background)

game.run()

let lastBallPlacted = 0
game.canvas.addEventListener('mouseup', (e) => {
  const now = performance.now()
  if (!game.isRunning || now - lastBallPlacted < 150) {
    return
  }

  const rect = game.canvas.getBoundingClientRect()

  lastBallPlacted = now
  game.add(Ball, {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    radius: 30,
    restitution: 0.5,
    mass: 30,
    image: images[Math.floor(Math.random() * images.length)],
  })
})

document.querySelector('#play')!.addEventListener('click', () => {
  game.run()
})

document.querySelector('#stop')!.addEventListener('click', () => {
  game.stop()
})

document.querySelector('#clear')!.addEventListener('click', () => {
  if (!game.isRunning) {
    return
  }

  for (const obj of game.objects) {
    if (obj instanceof Ball) {
      game.destroy(obj)
    }
  }
})
