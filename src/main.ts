import { Ball } from './objects/ball'
import { Game } from './game'
import { BallManager } from './objects/ball-manager'
import './style.css'

const game = new Game('#game')

game.assets.add('ball_black', '/spr_ball_black.png')
game.assets.add('ball_red', '/spr_ball_red.png')
game.assets.add('ball_white', '/spr_ball_white.png')
game.assets.add('ball_yellow', '/spr_ball_yellow.png')

game.add(BallManager)
game.run()

let pausedFromButton = false

document.addEventListener('blur', () => {
  if (game.isRunning) {
    game.pause()
  }
})

document.addEventListener('focus', () => {
  if (!game.isRunning && !pausedFromButton) {
    game.resume()
  }
})

document.querySelector('#play')!.addEventListener('click', () => {
  game.resume()
  pausedFromButton = false
})

document.querySelector('#pause')!.addEventListener('click', () => {
  game.pause()
  pausedFromButton = true
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
