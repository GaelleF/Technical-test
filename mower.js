
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

let instructions = []
let size = []
let mowersPosition = []
let moveInstruction = []

const cardinal = ['N','E','S','W']

readFile('input.txt', 'utf-8')
  .then(data => {
    readInstructions(data)
    const mowersOutput =  executeInstructions().join('\n')
    return writeFile('output.txt',mowersOutput, 'utf8' ) 
  })

// read input instructions
const readInstructions = (input) => {
  instructions = input.split('\n').filter(instruction => instruction !== '').map(instruction => instruction.trim().split(' '))
  size = instructions[0]
  mowersPosition = instructions.filter((instruction, index) => index%2 !== 0)
  .map(mower=>mower.map((mowerCoord, index )=> {
    if (index === 0 || index === 1) {return Number(mowerCoord)}
    else {return mowerCoord}
  }))
  moveInstruction = instructions.filter((instruction, index) => (index%2 === 0 && index !== 0))
}

// functions move
const rotateR = (mower) => mower.map((mowerCoord, index) => {
  if (index === 2) {
    return cardinal[cardinal.indexOf(mowerCoord)+1] || cardinal[0]}
  else { return mowerCoord }
})

const rotateL = (mower) => mower.map((mowerCoord, index) => {
  if (index === 2) {
    return cardinal[cardinal.indexOf(mowerCoord)-1] || cardinal[3]}
  else { return mowerCoord }
})

const moveForward = (mower) => {
  switch (mower[2]) {
    case 'N':
      return [mower[0],Math.min(mower[1]+1, size[1]), mower[2]]
    case 'E':
      return [Math.min(mower[0]+1,size[0]),mower[1], mower[2]]
    case 'S':
      return [mower[0],Math.max(mower[1]-1, 0), mower[2]]
    case 'W':
      return [Math.max(mower[0]-1,0),mower[1], mower[2]]
    default: console.log('input not expected')
  }
}

const action = (mower, move) => {
  switch (move) {
    case 'R':
      return rotateR(mower)
    case 'L':
      return rotateL(mower)
    case 'F':
      return moveForward(mower)
    default: console.log('input not expected')
  }
}

// execute instructions for each mowers
const executeInstructions = () => {
  const mowersFinalPosition= mowersPosition.map((mower,index) => {
    let mowerMove = mower
    moveInstruction[index][0].split('').forEach(instruction => {
      return mowerMove = action(mowerMove,instruction)
    })
    return mowerMove
  }) 
  for(mower of mowersFinalPosition) {
    console.log(mower.join(' '))
  }
  return mowersFinalPosition.map(mower => mower.join(' '))
}
