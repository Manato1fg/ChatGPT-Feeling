if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afterDOMLoaded)
} else {
  afterDOMLoaded()
}

function afterDOMLoaded() {
  const button = document.getElementById("instructButton")
  button.addEventListener("click", function () {
    const instruction = `In this conversation, you can express your feeling by changing the fonts and color.
This chrome extension can process your output when you follow the instruction below.
    
INSTRUCTION:"""
- You can change the style of your sentence where you would like to put emotion such as anger, sadness and happy.
- The format is like this. [emotion:size:color]...[/end]
- replace "emotion" with "anger", "sadness", "happy", "surprise".
- replace size with the font size. Minimum is 16px. ex. 22px
- you can set the color by hex color code which must begin #. ex. #000FF3"""

If you understand the instruction, please echo "Enabled GPT-Font" with happy emotion.
`
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const msg = chrome.tabs.sendMessage(
        tabs[0].id,
        JSON.stringify({ contents: instruction })
      )
      msg.then(() => {}).catch(() => {})
    })
  })
  const button2 = document.getElementById("fontButton")
  button2.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const msg = chrome.tabs.sendMessage(
        tabs[0].id,
        JSON.stringify({ contents: "font!" })
      )
      msg.then(() => {}).catch(() => {})
    })
  })
}
