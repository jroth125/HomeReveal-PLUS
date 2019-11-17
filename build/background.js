let state = {}

chrome.runtime.onMessage.addListener((message, sender, res) => {
    switch(message.type) {
        case 'BOROUGH':
            state['borough'] = message.borough
        case "CONTENT":
                chrome.tabs.query({active: true}, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, state)
                })
        default: 
            state = state
    }


})
