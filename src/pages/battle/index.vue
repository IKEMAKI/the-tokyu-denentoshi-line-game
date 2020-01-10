<docs>
  対戦ゲームページ
</docs>

<template lang="pug">
.battle
  // 設定
  p 難易度
  div
    button normal
  button wish you the best

  // 臨時残選択肢エリア
  p 全部の選択肢: {{ stationAll }}
  p 残りの選択肢: {{ stationRemaining }}

  // 臨時結果エリア
  p あなたのこたえ履歴: {{ answerHistory }}

  // 対戦エリア
  ul
    li(v-for="answer in answerHistory")
      p
        span(v-if="answer.human") あなた：
        |{{ answer.content }}
  p {{ msg }}

  // 入力欄
  form.answer(@submit.prevent="submitMyAnswer")
    input(type="text" v-model="myAnswer" @input="activateSubmit").answer-input
    button.answer-submit(v-bind:disabled="!submitEnabled") オーライ
</template>

<script src="./index.js"></script>

<style scoped lang="stylus" src="./index.styl"></style>
