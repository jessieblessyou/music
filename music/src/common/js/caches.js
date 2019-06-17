import storage from 'good-storage'

const searchKey = '__search__'
const searchLength = 15

const favoriteKey = '__favorite__'
const favoriteLength = 200

const songKey = '__historySong__'
const songLength = 200

function itemInsertKey (item, key, length) {
  let arr = storage.get(key)
  if (!arr) {
    arr = []
  }
  if (key === searchKey) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        arr.splice(i, 1)
      }
    }
  } else {
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].id === item.id) {
        arr.splice(j, 1)
      }
    }
  }
  arr.unshift(item)
  if (arr.length > length) {
    arr.pop()
  }
  storage.set(key, arr)
  return arr
}
function itemDeleteKey (item, key) {
  let arr = storage.get(key)
  if (!arr) {
    arr = []
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id === item.id) {
      arr.splice(i, 1)
    }
  }
  storage.set(key, arr)
  return arr
}

export function getSeachKey () {
  if (!storage.get(searchKey)) {
  	return []
  }
  return storage.get(searchKey)
}

export function setSearchKey (value) {
  return itemInsertKey(value, searchKey, searchLength)
}

export function setSearchHistory (arr) {
  storage.set(searchKey, arr)
}

export function removeSearchItem (index) {
  let arr = getSeachKey()
  arr.splice(index, 1)
  storage.set(searchKey, arr)
  return arr
}

export function clearSearch () {
  storage.remove(searchKey)
}

export function getFavoriteKey () {
  if (!storage.get(favoriteKey)) {
    return []
  }
  return storage.get(favoriteKey)
}

export function setFavoriteKey (song) {
  return itemInsertKey(song, favoriteKey, favoriteLength)
}

export function removeFavoriteItem (song) {
  return itemDeleteKey(song, favoriteKey)
}

export function getSongKey () {
  if (!storage.get(songKey)) {
    return []
  }
  return storage.get(songKey)
}

export function setSongKey (song) {
  return itemInsertKey(song, songKey, songLength)
}

export function removeSongItem (song) {
  return itemDeleteKey(song, songKey)
}
