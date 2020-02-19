<doc>対戦</doc>

<template lang="pug">
.battle
  // 対戦エリア
  ol.answer-list
    li.answer-item(v-for="answer in answerHistory" :class="{ isHuman: answer.human }")
      p.answer-balloon {{ answer.content }}
  // End 対戦エリア

  // GMメッセージ表示エリア
  .gm-msg(v-if="gm.msg")
    p.gm-msg-tx {{ gm.msg }}
  // End GMメッセージ表示エリア

  // 入力欄
  form.answer(@submit.prevent="submitMyAnswer")
    input(type="text" v-model="inputMyAnswer" v-bind:disabled="!isEnabled.input" placeholder="駅名を入力してね").answer-input
    button.parts-btn.answer-submit(v-bind:disabled="!isEnabled.submit") オーライ
  // End 入力欄

  // お助けゾーン
  Help
</template>

<style lang="stylus" scoped>
// 全体
.battle
  position relative
  padding-top 2em

//- 入力欄
.answer
  position fixed
  bottom 0
  left 0
  display flex
  width 100%
  padding 1em
  border-top 1px solid color_gray
  background-color color_bg

  &-input
    flex-grow 10
    padding-left .8em
    border 1px solid color_light_gray
    // placeholder
    &::placeholder
      opacity 1
      transition all .2s
    &[disabled]::placeholder
      opacity 0

  // オーライ
  &-submit
    margin-left 1em

//- 各解答表示エリア
.answer
  // 発言ブロック
  &-item
    display flex
    &+ .answer-item
      margin-top 1em

  // 発言内容
  &-balloon
    position relative
    padding .5em .8em
    background-color color_light_gray
    &::before
      content ""
      position absolute
      top 0
      left -1.4em
      border .7em solid transparent
      border-right 1.4em solid color_light_gray
      transform rotate(30deg)

  // 人間発言の場合
  &-item.isHuman
    .answer-balloon
      margin-left auto
      color color_bg
      background-color color_dento
      &::before
        left auto
        right -1.4em
        transform rotate(150deg)
        border-color transparent color_dento transparent transparent

// GMのメッセージ
.gm-msg
  display flex
  justify-content center
  margin 1em auto
  // 改行対応
  white-space pre-wrap
  &-tx
    font-size 1.4rem
    font-weight bold
    text-align center
    padding .5em .8em
    color color_gm
    border 2px solid color_gm
</style>

<script>
import dayjs from 'dayjs'

import Help from '~/components/game/Help'

export default {
  components: {
    Help
  },
  // 親から必要な情報受取
  // sta, time
  props: {
    'pass': {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      myAnswer: '',
      answerHistory: [],
      // ゲームマスター
      gm: {
        msg: '下のボックスに答えを入力してね\nオーライボタンで送信！',
      },
      // オーライボタン発車・入力可能
      isEnabled: {
        submit: false,
        input: false
      },
    }
  },
  computed: {
    // 解答を入力されたら
    inputMyAnswer: {
      get () {
        return this.myAnswer;
      },
      set(value) {
        this.myAnswer = value;
        // 文字が入っていれば送信可能にする
        if(value.length < 1) {
          this.isEnabled.submit = false;
        } else {
          this.isEnabled.submit = true;
        }
      }
    }
  },
  created() {
    // 開始時間保存
    this.$parent.time.start = dayjs();

    // 問題数が偶数ならCPUからスタート
    // （プレイヤーで終わるようにする）
    if((this.pass.sta.all.length % 2 === 0)) {
      this.processCPUTurn();
    } else {
      // 奇数ならプレイヤーのターン
      // 入力可能にする
      this.isEnabled.input = true;
    }
  },
  methods: {
    /**
     * 最下部へスクロール
     */
    scrollDown() {
      this.$nextTick(() => {
        const down = document.getElementById('__nuxt');
        down.scrollTop = down.scrollHeight;
      });
    },

    /**
     * オーライ押下時
     */
    submitMyAnswer() {
      // メッセージを空にしておく
      this.gm.msg = '';

      // 入力された答え
      const answer = this.myAnswer;
      // 残選択肢に存在するかチェック
      const isCorrect = this.pass.sta.remaining.some(item => item === answer);
      // 全選択肢にはあったかチェック（おしい）
      const isClose = this.pass.sta.all.some(item => item === answer);

      // 入力エリアを空にしておく
      this.myAnswer = '';
      // オーライ禁止にしておく
      this.isEnabled.submit = false;

      if(isCorrect) { // 残選択肢にあれば
        // 解答処理
        this.processWhenAnswer(true, answer);
        // 相手のターンへ
        this.processCPUTurn();
      } else if(isClose) { // 残選択肢にはないが全選択肢にはあれば
        this.gm.msg = answer + 'はもうでたよ';
        // 最下部スクロール
        this.scrollDown();
      } else { // 残選択肢になければ
        this.gm.msg = answer + 'はちがうよ';
        // 最下部スクロール
        this.scrollDown();
      }
    },

    /**
     * 解答成功時
     * @param {boolean} human 人間の解答ならばtrue
     * @param {string} ans 解答駅名
     */
    processWhenAnswer(human, ans) {
      // 解答履歴配列に追加
      this.answerHistory.push({human, 'content': ans});

      // 解答された選択肢を消す
      this.$parent.sta.remaining = this.pass.sta.remaining.filter(item => item !== ans);
      this.$parent.sta.cpu = this.pass.sta.cpu.filter(item => item !== ans);

      // 最下部スクロール
      this.scrollDown();
    },

    /**
     * cpuのターン
     */
    processCPUTurn() {
      // 入力・送信禁止
      this.isEnabled.input = false;
      this.isEnabled.submit = false;

      // 残選択肢がなければ投了
      if(this.pass.sta.cpu.length < 1) {
        // ゲーム終了処理へ
        this.endGame();
      } else {
        // あればランダムで選んで解答
        const choice = this.pass.sta.cpu[Math.floor(Math.random() * (this.pass.sta.cpu.length))];
        // 解答処理
        this.processWhenAnswer(false, choice);

        // 入力許可
        this.isEnabled.input = true;
      }
    },

    /**
     * ゲーム終了時
     */
    endGame() {
      // 差分（クリア時間）算出
      this.$parent.time.end = dayjs();
      this.$parent.time.diff = dayjs(this.pass.time.end).diff(this.pass.time.start, 'second', true);
      // フェーズ進行
      this.$parent.phase = 2;
    },
  }
}
</script>
