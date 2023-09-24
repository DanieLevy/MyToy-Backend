import fs from "fs"
import { utilService } from "./util.service.js"

const toys = utilService.readJsonFile("data/toys.json")

const PAGE_SIZE = 6

export const toyService = {
  query,
  get,
  remove,
  save,
}

function query(filterBy = {}) {
  var toysToDisplay = toys

  if (filterBy.txt) {
    toysToDisplay = toysToDisplay.filter((toy) =>
      toy.name.toLowerCase().includes(filterBy.txt.toLowerCase())
    )
  }

  if (filterBy.inStock) {
    toysToDisplay = toysToDisplay.filter((toy) => toy.inStock)
  }

  if (filterBy.maxPrice) {
    toysToDisplay = toysToDisplay.filter(
      (toy) => toy.price <= filterBy.maxPrice
    )
  }

  if (filterBy.labels && filterBy.labels.length) {
    toysToDisplay = toysToDisplay.filter((toy) => {
      return filterBy.labels.some((label) => {
        const cleanLabel = label.trim().toLowerCase() // Convert to lowercase and trim
        return toy.labels.some(
          (toyLabel) => toyLabel.trim().toLowerCase() === cleanLabel
        )
      })
    })
    if (!toysToDisplay.length) return Promise.reject("No toys found")
  }

  if (filterBy.sortBy === "name") {
    filterBy.sortDir === "asc"
      ? toysToDisplay.sort((a, b) => a.name.localeCompare(b.name))
      : toysToDisplay.sort((a, b) => b.name.localeCompare(a.name))
  }
  if (filterBy.sortBy === "price") {
    filterBy.sortDir === "asc"
      ? toysToDisplay.sort((a, b) => a.price - b.price)
      : toysToDisplay.sort((a, b) => b.price - a.price)
  }
  if (filterBy.sortBy === "createdAt") {
    filterBy.sortDir === "asc"
      ? toysToDisplay.sort((a, b) => a.createdAt - b.createdAt)
      : toysToDisplay.sort((a, b) => b.createdAt - a.createdAt)
  }

  const toysBeforeSlice = toysToDisplay

  if (filterBy.pageIdx) {
    const startIdx = (filterBy.pageIdx - 1) * PAGE_SIZE
    toysToDisplay = toysToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return Promise.resolve({
    toys: toysToDisplay,
    toysBeforeSlice,
  })
}

function get(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  if (!toy) return Promise.reject("Toy not found")
  return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  if (idx === -1) return Promise.reject("No Such Toy")
  const toy = toys[idx]
  // if (car.owner._id !== loggedinUser._id) return Promise.reject('Not your car')
  toys.splice(idx, 1)
  return _saveToyToFile().then(() => toy)
}

function save(toy, loggedinUser) {
  if (toy._id) {
    const toyToUpdate = toys.find((currToy) => currToy._id === toy._id)
    // if (toyToUpdate.owner._id !== loggedinUser._id)
    //     return Promise.reject("Not your toy")
    toyToUpdate.name = toy.name
    toyToUpdate.price = toy.price
    toyToUpdate.labels = toy.labels
    toyToUpdate.inStock = toy.inStock
  } else {
    toy._id = _makeId()
    toy.createdAt = Date.now()
    // toy.owner = loggedinUser
    toys.push(toy)
  }
  return _saveToyToFile().then(() => toy)
}

function _makeId(length = 5) {
  let text = ""
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function _saveToyToFile() {
  return new Promise((resolve, reject) => {
    const toysStr = JSON.stringify(toys, null, 2)
    fs.writeFile("data/toys.json", toysStr, (err) => {
      if (err) {
        return console.log(err)
      }
      console.log("The file was saved!")
      resolve()
    })
  })
}
