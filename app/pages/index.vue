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
          >{{number}}</li>
        </ol>
      </div>

      <section>
        <h3 class="visually-hidden">テキストエリア</h3>

        <div>
          <textarea 
            v-model="text"
            name="text"
            id="text"
            v-bind:rows="textareaRow"
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
            <span class="message__meta">Index: {{message.index}}</span>
            <span class="message__body">{{message.message}}</span>
          </li>
        </ul>
      </section>

    </section>
  </section>
</template>

<script>
import ipcPromise from 'ipc-promise'

// import messages from '~/mocks/messages.json'

export default {
  data () {
    return {
      text: '',
      messages: [],
    }
  },

  watch: {
    async text (value) {
      const result = await ipcPromise.send('textlint', value)
      // console.log(result)
      this.messages = result.messages
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
  background-color: $cbg-default;
  outline: none;
  font-size: 2rem;
  line-height: $line-height;
}

.lines {
  margin: 0;
  padding: 0;
  color: $ct-line;
}

.line {
  height: 2rem * $line-height;
  padding-top: .8rem;
  text-align: right;
  font-size: 1.2rem;
}

.linter-result {
  position: relative;
}

.messages {
  position: fixed;
  top: 16px;
  z-index: 2;
  width: 100%;
  height: 100vh;
  margin: 0;
  border-top: solid 1px $cb-default;
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
}

.message__meta {
  grid-row: 1;
  font-size: 1rem;
}

.message__body {
  grid-row: 2;
  grid-column: 1 / span 3;
  font-size: 1.2rem;
}

</style>
