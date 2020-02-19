<doc>ヘルプ（ヒント・リタイア）</doc>

<template lang="pug">
.help
  button.icon(type="button" @click="isOpen = !isOpen" :class="{'is-open': isOpen}") ？

  transition(name="fade")
    .bg(v-if="isOpen")
      ul.list
        li.item
          button.btn(type="button") ヒント
        li.item
          button.btn(type="button" @click="confirmSurrender = true" v-show="!confirmSurrender") 降参
          div(v-show="confirmSurrender")
            p 本当に降参する？
            button.btn.select(type="button" @click="doSurrender()") うん
            br
            button.btn.select(type="button" @click="dontSurrender()") まだだ
</template>

<style lang="stylus" scoped>
// 全体
.help
  position absolute
  top 1em
  left 0
  width 100%

// 背景
.bg
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background-color color_base
  opacity .8
  z-index 1

// ハテナ
.icon
  position absolute
  right 0
  top 0
  color color_accent
  font-weight 600
  display flex
  justify-content center
  align-items center
  width 2em
  height 2em
  border 2px solid color_accent
  border-radius 50%
  cursor pointer
  z-index 2
  transition color .3s, border-color .3s
  &.is-open
    color color_bg
    border-color color_bg

// 選択肢
.list
  position absolute
  top 2.5em
  left 0
  right 0
  margin auto
  font-size 2rem
  color color_bg
  text-align center
.item + .item
  margin-top 1.4em

.btn
  color color_bg

// 本当に？
.select
  margin-top .5em

// トランジション
.fade-enter-active, .fade-leave-active
  transition opacity .3s
.fade-enter, .fade-leave-to
  opacity 0
</style>

<script>
export default {
  data() {
    return {
      isOpen: false,
      confirmSurrender: false,
    }
  },
  methods: {
    // まだ
    dontSurrender() {
      this.confirmSurrender = false;
      this.isOpen = false;
    },
    // 降参する
    doSurrender() {

    }
  }
}
</script>
