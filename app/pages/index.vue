<template>
  <section>
    <header class="header">
      <h1 class="visually-hidden">My authoring</h1>
    </header>

    <section class="edit-area">
      <h2 class="visually-hidden">編集エリア</h2>

      <section>
        <h3 class="visually-hidden">テキストエリア</h3>

        <div>
          <textarea 
            v-model="text"
            name="text"
            id="text"
            cols="30"
            rows="100"
            class="textarea"
          ></textarea>
        </div>
      </section>

      <section>
        <h3 class="visually-hidden">プレビュー</h3>
      </section>
    </section>
  </section>
</template>

<script>
import ipcPromise from 'ipc-promise'

export default {
  data () {
    return {
      text: '',
    }
  },

  watch: {
    async text (value) {
      const result = await ipcPromise.send('textlint', value)
      console.log(result)
    },
  },
}
</script>

<style lang="scss" scoped>

// .header {
//   height: 4rem;
//   box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
// }

.edit-area {
  padding: 1em 0;
}

.textarea {
  width: 100%;
  border: none;
  padding: 1em;
  background-color: $cbg-default;
  outline: none;
  font-size: 2rem;
  line-height: 1.6;
}

</style>
