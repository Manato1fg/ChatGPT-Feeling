/**
 * GPT-FONT
 * @author Manato1fg
 * @license MIT
 * @version 1.0.0
 *
 * This chrome extension process the output of ChatGPT in https://chat.openai.com/chat.
 * It replaces the font of the output where GPT determine the font by setting emotion, size and color.
 * The format is as follows.
 * [emotion:size:color]text[/end]
 *
 * GPT can select the following emotions.
 * happy, sad, angry, surprise
 * GPT can set the size by pixel like 10px.
 * GPT can set the color by hex code like #000000.
 *
 * This extension send GPT an instruction when the user enables it.
 *
 * ====== INSTRUCTION MESSAGE ======
 * In this conversation, you can express your feeling by changing the fonts and color.
 * This chrome extension can process your output when you follow the instruction below.
 *
 * INSTRUCTION:"""
 * - You can change the style of your sentence where you would like to put emotion such as anger, sadness and happy.
 * - The format is like this. [emotion:size:color]...[end]
 * - replace "emotion" with "anger", "sadness", "happy", "surprise".
 * - replace size with the font size. ex. 10px
 * - you can set the color by hex color code which must begin #. ex. #000FF3
 * """
 * =================================
 *
 * The fonts used in this extension are free to use, distribute and modify, also aim to express the emotion of the text.
 * HOWEVER, YOU ARE NOT ALLOWED TO USE, DISTRIBUTE AND MODIFY THE FONTS DIRECTLY FROM THIS EXTENSION.
 * font.txt contains the information of the fonts used in this extension.
 * You can download the fonts from the link in font.txt.
 */

/**
 * parse the text and replace the font.
 * @param {string} text
 * @return {string} replacedText
 */
function parseFont(text) {
  const pattern = /\[.+?:[0-9]{1,}px:#[0-9A-F]{6}\].+?\[\/end\]/g
  const replacedText = text.replace(pattern, (match) => {
    match = match.replace("[/end]", "") // remove [/end]
    const fontTagPattern = /\[.+?:[0-9]{1,}px:#[0-9A-F]{6}\]/
    const fontTag = match.match(fontTagPattern)[0] // get the font tag
    const options = fontTag.split(":")
    const emotion = options[0].replace("[", "") // get the emotion
    const size = options[1] // get the size
    const color = options[2].replace("]", "") // get the color
    const text = match.replace(fontTag, "") // get the text
    return `<span style="font-family: ${emotion}; font-size: ${size}; color: ${color};">${text}</span>`
  })
  return replacedText
}
/**
 * Parse the GPT output
 * @param null
 * @return null
 */
function replaceGPTReply() {
  const selectors = document.getElementsByClassName("text-base")
  // if the selector is not null
  if (selectors.length > 0) {
    // loop through the selector by 2 because the selector contains the user's input and GPT's output
    for (let i = 1; i < selectors.length; i += 2) {
      const textWrapper = selectors[i].querySelector(".dark")
      if (textWrapper === null) continue
      const text = textWrapper.innerHTML
      let replacedText = parseFont(text)
      textWrapper.innerHTML = replacedText
    }
  }
}

// const submitButton = document.querySelector("button.text-gray-500")

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afterDOMLoaded)
} else {
  afterDOMLoaded()
}

function afterDOMLoaded() {
  // 受信側 other tab -> contents(popup/option -> contents)
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (JSON.parse(message).contents === "font!") {
      replaceGPTReply()
      return
    }
    const textarea = document.querySelector("textarea")
    textarea.value = JSON.parse(message).contents
    const parent = textarea.parentNode
    setTimeout(() => {
      const button = parent.querySelector("button")
      button.disabled = false
      button.click()
    }, 1000) // wait for the button to be loaded
    return
  })
  setTimeout(() => {
    replaceGPTReply()
  }, 1000)
  /*
  // add the event listener
  const chat = document.getElementsByClassName(
    "react-scroll-to-bottom--css-ejicj-1n7m0yu"
  )[0]
  if (chat) {
    chat.addEventListener("DOMNodeInserted", () => {
      setTimeout(() => {
        replaceGPTReply()
      }, 10000)
    })
  }
  */
}
