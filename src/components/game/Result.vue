<doc>結果画面</doc>

<template lang="pug">
.result
  p おめでとう！
  p クリアタイム: {{ pass.time.diff }}秒
  p 難易度: {{ difficulty }}
  p モード: {{ mode }}
  button.parts-btn(type="button" @click="retry()") もっかいやる
</template>

<script>
export default {
  // 親から必要な情報受取
  // config, time
  props: {
    'pass': {
      type: Object,
      require: true
    }
  },
  computed: {
    // 難易度
    difficulty() {
      return (this.pass.config.difficulty === 'normal') ? 'ふつう' : '神';
    },
    // モード
    mode() {
      return (this.pass.config.mode === 'all') ? '全駅' : (this.pass.config.mode === 'express') ? '急行' : '各駅';
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
