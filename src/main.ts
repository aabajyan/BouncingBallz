import { Ball } from './objects/ball'
import { Game } from './game'
import './style.css'

const game = new Game('#game')

game.add(Ball, 20, 20)
game.run()
