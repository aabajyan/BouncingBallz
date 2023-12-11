import { Ball } from './objects/ball'
import { Game } from './game'
import { Background } from './objects/background'
import './style.css'

const game = new Game('#game')

const images = ['ball_black', 'ball_red', 'ball_white', 'ball_yellow']
game.assets.add('ball_black', 'public/spr_ball_black.png')
game.assets.add('ball_red', 'public/spr_ball_red.png')
game.assets.add('ball_white', 'public/spr_ball_white.png')
game.assets.add('ball_yellow', 'public/spr_ball_yellow.png')

game.add(Background)

game.run()

game.canvas.addEventListener('mouseup', (e) => {
  const rect = game.canvas.getBoundingClientRect()
  const radius = Math.random() * 20 + 10

  game.add(Ball, {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    radius: radius,
    restitution: 0.5,
    mass: radius,
    image: images[Math.floor(Math.random() * images.length)],
  })
})
