const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.result')
let result = 0
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []

for (let i = 0; i < 255; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))
squares[currentShooterIndex].classList.add('shooter')

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function drawInvaders () {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  }
}
function removeInvaders () {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}
drawInvaders()

function moveShooter (e) {
  squares[currentShooterIndex].classList.remove('shooter')
  switch (e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
      break
    case 'ArrowRight':
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
      break
  }
  squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

function moveInvaders () {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
  removeInvaders()

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1
      direction = -1
      goingRight = false
    }
  }
  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }
  drawInvaders()

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = 'Game Over!'
    clearInterval(invadersId)
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squares.length - (width * 2)) {
      resultsDisplay.innerHTML = 'Game Over!'
      clearInterval(invadersId)
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'You Win' + result
    clearInterval(invadersId)
  }
}
invadersId = setInterval(moveInvaders, 1000)

function shoot (e) {
  let laserId
  let currentlaserIndex = currentShooterIndex

  function moveLaser () {
    if (currentlaserIndex - width <= 0) {
      squares[currentlaserIndex].classList.remove('laser')
    } else {
      squares[currentlaserIndex].classList.remove('laser')
      currentlaserIndex -= width
      squares[currentlaserIndex].classList.add('laser')
    }
    // squares[currentlaserIndex].classList.remove('laser')
    // currentlaserIndex -= width
    // squares[currentlaserIndex].classList.add('laser')

    if (squares[currentlaserIndex].classList.contains('invader')) {
      squares[currentlaserIndex].classList.remove('laser')
      squares[currentlaserIndex].classList.remove('invader')
      squares[currentlaserIndex].classList.add('boom')

      setTimeout(() => squares[currentlaserIndex].classList.remove('boom'), 300)
      clearInterval(laserId)

      const alienRemoved = alienInvaders.indexOf(currentlaserIndex)
      aliensRemoved.push(alienRemoved)
      result++
      resultsDisplay.innerHTML = result
    }
  }
  switch (e.key) {
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 100)
      break
  }
}

document.addEventListener('keydown', shoot)
