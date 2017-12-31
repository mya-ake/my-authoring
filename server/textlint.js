const { TextLintCore } = require('textlint')
const textlintRulePresetJapanese = require('textlint-rule-preset-japanese')

const textlint = new TextLintCore()
textlint.setupRules(
  textlintRulePresetJapanese.rules,
  textlintRulePresetJapanese.rulesConfig
)

const ipcPromise = require('ipc-promise')

const registerIPC = () => {
  ipcPromise.on('textlint', (text) => {
    return textlint.lintMarkdown(text)
  })
}

module.exports = {
  registerIPC,
}
