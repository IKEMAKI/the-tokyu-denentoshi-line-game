<doc>結果画面</doc>

<template lang="pug">
.result
  p おめでとう！
  p クリアタイム: {{ diff }}秒
  p 難易度: {{ difficulty }}
  p モード: {{ mode }}
  button.parts-btn(type="button" @click="retry()") もっかいやる
</template>

<style lang="stylus" scoped>

</style>

<script>
export default {
  // 親から受け取る
  props: {
    // クリアタイム（ミリ秒）
    'diff': {
      type: Number,
      default: 0
    },
    // 設定（難易度, モード）
    'config': {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 難易度
    difficulty() {
      return (this.config.difficulty === 'normal') ? 'ふつう' : '神';
    },
    // モード
    mode() {
      return (this.config.mode === 'all') ? '全駅' : (this.config.mode === 'express') ? '急行' : '各駅';
    }
  },
  methods: {
    // リトライ☆
    retry() {
      window.location.reload();
    }
  },
}
</script>
