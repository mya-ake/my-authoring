const ipcPromise = require('ipc-promise')
const path = require('path')

const { TextLintCore } = require('textlint')
const textlintRulePresetJapanese = require('textlint-rule-preset-japanese')
const textlintRulePresetJtfStyle = require('textlint-rule-preset-jtf-style')
const textlintRuleSpellcheckTechWord = require('textlint-rule-spellcheck-tech-word')
const textlintRulePrh = require('textlint-rule-prh')

// initialize textlint
const textlint = new TextLintCore()
textlint.setupRules(
  Object.assign({},
    textlintRulePresetJapanese.rules,
    textlintRulePresetJtfStyle.rules,
    {
      'spellcheck-tech-word': textlintRuleSpellcheckTechWord,
      'prh': textlintRulePrh,
    }
  ),
  Object.assign({},
    textlintRulePresetJapanese.rulesConfig,
    textlintRulePresetJtfStyle.rulesConfig,
    {
      'prh': {
        'rulePaths': [
          path.resolve(__dirname, '..', 'prh.yml'),
        ],
      },
    }
  )
)

// register api
const registerTextLintApi = () => {
  ipcPromise.on('textlint', (text) => {
    return textlint.lintMarkdown(text)
  })
}

module.exports = {
  registerTextLintApi,
}
