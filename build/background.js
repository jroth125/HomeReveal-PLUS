let state = {}

chrome.runtime.onMessage.addListener((message, sender, res) => {
    console.log('The message is...', message)
    switch(message.type) {
        case 'BOROUGH':
            state['borough'] = message.borough
        case "CONTENT":
                chrome.tabs.query({active: true}, (tabs) => {
                    console.log('the tab is', tabs[0])
                    chrome.tabs.sendMessage(tabs[0].id, state)
                })
        default: 
            state = state
    }

console.log('state is now, ', state)
})
