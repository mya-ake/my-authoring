<template>
  <section>
    <header class="header">
      <h1 class="visually-hidden">My authoring</h1>
    </header>

    <section class="edit-area">
      <h2 class="visually-hidden">編集エリア</h2>

      <div>
        <ol class="lines">
          <li
            v-for="(number, index) in line"
            v-bind:key="`line-${index}`"
            class="line"
            v-bind:data-has-error="hasErrorLine(number)"
          >{{number}}</li>
        </ol>
      </div>

      <section>
        <h3 class="visually-hidden">テキストエリア</h3>

        <div>
          <textarea 
            v-model="text"
            ref="text"
            name="text"
            id="text"
            v-bind:rows="textareaRow"
            v-on:keydown.prevent.tab="handleKeyDownTab"
            wrap="off"
            class="textarea"
          ></textarea>
        </div>
      </section>

      <section>
        <h3 class="visually-hidden">プレビュー</h3>
      </section>

      <section class="linter-result">
        <h3 class="visually-hidden">linter結果</h3>
        <ul class="messages">
          <li
            v-for="(message, index) in messages"
            v-bind:key="`message-${index}`"
            class="message"
          >
            <span class="message__meta">Line: {{message.line}}</span>
            <span class="message__meta">Column: {{message.column}}</span>
            <span class="message__meta">Index: <a href="" v-on:click.prevent="handleClickIndex(message.index)">{{message.index}}</a></span>
            <span class="message__rule">{{message.ruleId}}</span>
            <span class="message__body">{{message.message}}</span>
          </li>
        </ul>
      </section>

    </section>
  </section>
</template>

<script>
import ipcPromise from 'ipc-promise'
import { remote } from 'electron'

export default {
  data () {
    return {
      text: '',
      messages: [],
      processIds: {
        lint: null,
        save: null,
      },
      fileName: null,
    }
  },

  mounted () {
    remote.dialog.showOpenDialog(null, {
      properties: ['openFile'],
      filters: [
        {name: 'Markdown', extensions: ['md']},
      ],
    },
    this.openFileCallback
    )
  },

  watch: {
    text (value) {
      this.lint(value)
      this.save(value)
    },
  },

  computed: {
    line () {
      return this.text.split(/\n/).length
    },

    textareaRow () {
      return Math.max(this.line, 30)
    },
  },

  methods: {
    hasErrorLine (number) {
      return this.messages
        .some((message) => {
          return message.line === number
        })
    },

    lint (value) {
      clearTimeout(this.processIds.lint)
      this.processIds.lint = setTimeout(async () => {
        const result = await ipcPromise.send('textlint', value)
        this.messages = result.messages
      }, 100)
    },

    save (value) {
      if (this.fileName === null) {
        return
      }

      clearTimeout(this.processIds.save)
      this.processIds.save = setTimeout(async () => {
        const result = await ipcPromise.send('file:save', {
          fileName: this.fileName,
          data: value,
        })
        if (result === false) {
          // failed
        }
      }, 2000)
    },

    async openFileCallback (fileNames) {
      if (typeof fileNames === 'undefined') {
        this.fileName = null
        return
      }
      const fileName = fileNames[0]
      if (typeof fileName !== 'string' || fileName.length === 0) {
        this.fileName = null
        return
      }
      const fileData = await ipcPromise.send('file:open', fileName)
      this.text = fileData
      this.fileName = fileName
    },

    handleClickIndex (index) {
      this.$refs.text.focus()
      this.$refs.text.setSelectionRange(index, index)
      // このようにしないとスクロールしてくれない模様（問題があれば scrollTop などを使用するように
      this.$refs.text.blur()
      this.$refs.text.focus()
    },

    handleKeyDownTab () {
      this.appendString('  ')
    },

    appendString (str) {
      const selectionStart = this.$refs.text.selectionStart
      const beforeString = this.text.substring(0, selectionStart)
      const afterString = this.text.substring(selectionStart)
      this.text = `${beforeString}${str}${afterString}`
      const nextSelectionStart = selectionStart + str.length
      this.$nextTick()
        .then(() => {
          this.$refs.text.setSelectionRange(nextSelectionStart, nextSelectionStart)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
$line-height: 1.6;

// .header {
//   height: 4rem;
//   box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
// }

.edit-area {
  display: grid;
  grid-template-columns: 32px 1fr 0 320px;
  padding: 1em 0;
}

.textarea {
  width: 100%;
  border: none;
  padding: 0 8px;
  background-color: transparent;
  outline: none;
  font-size: 2rem;
  line-height: $line-height;
  resize: none;
}

.lines {
  margin: 0;
  padding: 0;
  color: $ct-line;
}

.line {
  position: relative;
  height: 2rem * $line-height;
  padding-top: 1rem;
  text-align: right;
  font-size: 1.2rem;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    opacity: .6;
    z-index: -1;
    // transition: background-color .1s ease-in-out;
  }

  &[data-has-error] {
    &::after {
      content: '';
      background-color: $cb-error;
    }
  }
}

.linter-result {
  position: relative;
  background-color: $cbg-default;
}

.messages {
  position: fixed;
  top: 16px;
  z-index: 2;
  width: 100%;
  max-width: 320px;
  height: 100vh;
  margin: 0;
  padding: 0;
  color: $ct-lint-message;
  overflow-y: scroll;
}

.message {
  display: grid;
  grid-row-gap: 8px;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 16px;
  border-bottom: solid 1px $cb-default;
  padding: 16px 8px;
  &:first-child {
    border-top: solid 1px $cb-default;
  }
}

.message__meta {
  grid-row: 1;
  font-size: 1rem;
}

.message__rule {
  grid-row: 2;
  grid-column: 1 / span 3;
  font-size: 1rem;
}

.message__body {
  grid-row: 3;
  grid-column: 1 / span 3;
  font-size: 1.2rem;
  line-height: 1.2;
}

</style>
