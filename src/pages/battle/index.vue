<doc>対戦</doc>

<template lang="pug">
.battle

  // フェーズ０
  .config(v-if="phase === 0")
    // 設定
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
    button.config-btn(type="button" @click="startGame()") はじめる
  // End フェーズ０

  // フェーズ１
  template(v-if="phase === 1")
    // 対戦エリア
    ol.answer-list
      li.answer-item(v-for="answer in answerHistory" v-bind:class="{ isHuman: answer.human }")
        p.answer-balloon {{ answer.content }}
    // End 対戦エリア

    // GMメッセージ表示エリア
    .gm-msg(v-if="gm.msg")
      p.gm-msg-tx {{ gm.msg }}
    // End GMメッセージ表示エリア

    // ギブアップボタン（仮
    button.parts-btn(type="button") ギブアップ
    // End ギブアップボタン（仮

    // 入力欄
    form.answer(@submit.prevent="submitMyAnswer")
      input(type="text" v-model="inputMyAnswer" v-bind:disabled="!isEnabled.input" placeholder="駅名を入力してね").answer-input
      button.answer-submit(v-bind:disabled="!isEnabled.submit") オーライ
    // End 入力欄
  // End フェーズ１

  // phase2 結果画面
  template(v-if="phase === 2")
    Result(:diff="time.diff" :config="config")
  // End phase2 結果画面
</template>

<script src="./index.js"></script>

<style scoped lang="stylus" src="./index.styl"></style>
