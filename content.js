const replaceUserImage = (row, imgBase64) => {
    const imgEl = document.createElement("img")
    imgEl.src = imgBase64
    imgEl.height = 35
    imgEl.width = 35
    imgEl.classList.add('userPicture')
    const initialsEl = row.querySelector('.userinitials')
    initialsEl.replaceWith(imgEl)
}

const init = async () => {
    const rows = document.querySelectorAll('#participants tr[id^="user-index-participants"]')
    rows.forEach(async (row) => {
        const p = row.querySelector('.userpicture')
        if (p != null) return
        const input = row.querySelector('input')
        if (input == null) return
        const userId = input.id.replace('user','')
        console.log(userId)
        
        const rsp = await chrome.runtime.sendMessage({
            action: 'GET_AVATAR',
            studentId: userId
        })
        replaceUserImage(row, rsp.img)
    })
}

init()

console.log('Hola desde el content script')
