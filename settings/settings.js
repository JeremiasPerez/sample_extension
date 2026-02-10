
const styleKey = 'USER_STYLE'

const loadStoredOpts = async () => {
    const opts = await chrome.storage.local.get([styleKey])
    if (opts[styleKey] == null) return
    const selectedStyle = opts[styleKey]
    const oEl = document.querySelector(`option[value="${selectedStyle}"]`)
    oEl.selected = true
}

const init = async () => {
    const menu = document.querySelector('#selector-estilo')
    menu.addEventListener('change', async (e) => {
        const obj = {}
        obj[styleKey] = menu.value
        await chrome.storage.local.set(obj)
        console.log("Todo ok por aquí")
    })
}

loadStoredOpts()
init()
