
const blob2base64 = async (blob, mimeType) => {
  const buf = await blob.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i=0; i<bytes.length; i++){
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return `data:${mimeType};base64,${base64}`
};

const esperar = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const getAvatar = async (userId, sendResponse) => {
  const key = `AVATAR_${userId}`
  const ret = await chrome.storage.local.get([key])
  if (ret[key] != null){
      sendResponse({ok: true, img: ret[key]})
      return
  }
  
  const style = 'pixel-art'
  const url = `https://api.dicebear.com/9.x/${style}/png?seed=${userId}`

  const response = await fetch(url)
  console.log(response)
  const avatar = await response.blob()
  const imgBase64 = await blob2base64(avatar, 'image/png')
  sendResponse({ok: true, img: imgBase64})
  const obj = {}
  obj[key] = imgBase64
  chrome.storage.local.set(obj)
}

let ultimoAlumno = Promise.resolve()

const addToQueue = (studentId, sendResponse) => {
  const p = ultimoAlumno.then(async () => {
      await esperar(2000)
      getAvatar(studentId, sendResponse)
  })
  ultimoAlumno = p
  return p
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== 'GET_AVATAR') return
  if (msg.studentId == null) return
  addToQueue(msg.studentId, sendResponse)
  return true
})