<doc>Setting 難易度・モード設定</doc>

<template lang="pug">
div
  dl
    dt.config-term 難易度を選んでね
    dd
      ul.config-list
        li.config-item
          label.radio
            input(type="radio" value="normal" v-model="config.difficulty")
            span.radio-tx ふつう
        li.config-item
          label.radio
            input(type="radio" value="god" v-model="config.difficulty" class="radio")
            span.radio-tx 神

    dt.config-term モードを選んでね
    dd
      ul.config-list
        li.config-item
          label.radio
            input(type="radio" value="all" v-model="config.mode")
            span.radio-tx すべての駅
        li.config-item
          label.radio
            input(type="radio" value="express" v-model="config.mode")
            span.radio-tx 急行停車駅のみ
        li.config-item
          label.radio
            input(type="radio" value="local" v-model="config.mode")
            span.radio-tx 急行に飛ばされる駅のみ
  button(@click="startGame()" type="button" class="config-btn") はじめる
</template>

<style scoped lang="stylus">
//- 臨時共通パーツ
.btn-common
  color color_bg
  padding .5em
  background-color color_dento
  +mq_pc()
    transition opacity .2s
    &:hover
      opacity .7
  &[disabled]
    background-color color_gray
    &:hover
      opacity 1

//- 設定エリア
.config
  // 選んでね
  &-term
    font-size 1.8rem
    margin-top 1.5em

  &-list
    margin .5em 0 0 2em

  &-item + .config-item
    margin-top .3em

  // スタートボタン
  &-btn
    @extend .btn-common
    margin-top 1.5em

//- ラジオボタン
.radio
  cursor pointer
  &-tx
    position relative
    padding-left .7em
    &::before, &::after
      content ""
      position absolute
      left -1em
      top .2em
      width .8em
      height .8em
      border-radius 50%
    &::before
      border 1.5px solid color_dento

  [type="radio"]:checked + .radio-tx::before
      background-color color_dento
</style>

<script>
export default {

}
</script>
