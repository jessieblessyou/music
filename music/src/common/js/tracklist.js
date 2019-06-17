import { Base64 } from 'js-base64'
import {lyrics} from '@/api/lyrics.js'

class Song {
  constructor ({album, albummid, duration, id, image, mid, name, singer, url}) {
    this.album = album
    this.albummid = albummid
    this.duration = duration
    this.id = id
    this.image = image
    this.mid = mid
    this.name = name
    this.singer = singer
    this.url = url
  }
  getLyrics () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      lyrics(this.mid).then((res) => {
        this.lyric = Base64.decode(res.body.lyric)
        resolve(this.lyric)
      }, function (res) {
        reject(res)
      })
    })
  }
}

export function trackData (data) {
  return new Song({
    album: data.albumname,
    albummid: data.albummid,
    duration: data.interval,
    id: data.songid,
    mid: data.songmid,
    name: data.songname,
    singer: data.singer,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${data.songmid}.m4a?guid=5029508047&vkey=89857C5F7B764A2C61135FB33CA597A2C940E815F63CA0B2AEC5C633B1BCF9E8D30F7979CC353456207F6DD33FF9EF81FFCCAFB64436E336&uin=0&fromtag=38`
  })
}

export function localTrackData (data) {
  return new Song({
    album: data.album,
    albummid: data.albummid,
    duration: data.duration,
    id: data.id,
    mid: data.mid,
    name: data.name,
    singer: data.singer,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${data.mid}.m4a?guid=5029508047&vkey=89857C5F7B764A2C61135FB33CA597A2C940E815F63CA0B2AEC5C633B1BCF9E8D30F7979CC353456207F6DD33FF9EF81FFCCAFB64436E336&uin=0&fromtag=38`
  })
}
