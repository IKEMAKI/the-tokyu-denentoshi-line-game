<doc>ゲーム</doc>

<template lang="pug">
.game
  // phase0 設定
  template(v-if="phase === 0")
    Setting(:pass="toSetting")

  // phase1 対戦
  template(v-else-if="phase === 1")
    Battle(:pass="toBattle")

  // phase2 結果画面
  template(v-else-if="phase === 2")
    Result(:pass="toResult")

</template>

<style scoped lang="stylus">
.game
  padding 0 1em
  padding-bottom calc(75px + 1em)
  margin auto
  max-width 500px
  // 吹き出し対策
  overflow-x hidden
</style>

<script>
import Setting from '~/components/game/Setting'
import Battle from '~/components/game/Battle'
import Result from '~/components/game/Result'

export default {
  components: {
    Setting,
    Battle,
    Result
  },
  data() {
    return {
      // 駅名系まとめ
      sta: {
        all: [],
        remaining: [], // 残選択肢
        express: ['中央林間', '南町田グランベリーパーク', '長津田'],
        local: ['つきみ野', 'すずかけ台', 'つくし野'],
        cpu: [], // cpu知識
      },
      // フェーズ
      phase: 0,
      // 設定
      config: {
        difficulty: 'normal', // normal,
        mode: 'all', // all,
      },
      // タイムアタック
      time: {
        start: '',
        end: '',
        diff: '',
      },
    }
  },
  computed: {
    // Settingに渡す情報
    toSetting() {
      const obj = {
        sta: this.sta,
        config: this.config,
        time: this.time,
      }
      return obj;
    },
    // Battleに渡す情報
    toBattle() {
      const obj = {
        sta: this.sta,
        time: this.time,
      }
      return obj;
    },
    // Resultに渡す情報
    toResult() {
      const obj = {
        config: this.config,
        time: this.time,
      }
      return obj;
    }
  }
}
</script>
