import fs from "fs"

const ROBO_URL = "https://robohash.org"

export const utilService = {
  readJsonFile,
  makeLorem,
  generateRobotImage,
}

export function readJsonFile(path) {
  const str = fs.readFileSync(path, "utf8")
  const json = JSON.parse(str)
  return json
}

export function makeLorem(size = 100) {
  var words = [
    "The sky",
    "above",
    "the port",
    "was",
    "the color of television",
    "tuned",
    "to",
    "a dead channel",
    ".",
    "All",
    "this happened",
    "more or less",
    ".",
    "I",
    "had",
    "the story",
    "bit by bit",
    "from various people",
    "and",
    "as generally",
    "happens",
    "in such cases",
    "each time",
    "it",
    "was",
    "a different story",
    ".",
    "It",
    "was",
    "a pleasure",
    "to",
    "burn",
  ]
  var txt = ""
  while (size > 0) {
    size--
    txt += words[Math.floor(Math.random() * words.length)] + " "
  }
  return txt
}

function generateRobotImage(id) {
    return `${ROBO_URL}/${id}`
}
