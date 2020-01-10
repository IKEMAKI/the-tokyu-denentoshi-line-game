export default {
  data() {
    return {
      stationAll: [],
      stationRemaining: [],
      stationExpress: ['中央林間', '南町田グランベリーパーク', '長津田'],
      stationLocal: ['つきみ野', 'すずかけ台', 'つくし野'],

      myAnswer: '',
      answerHistory: [],

      msg: '',

      // オーライボタン発車可能
      submitEnabled: true,
    }
  },
  created() {
    // ゲームに使われる全駅の配列を作成しておく
    this.stationAll = this.stationExpress.concat(this.stationLocal);

    // こちらは解答できる残選択肢の駅名配列
    this.stationRemaining = this.stationAll;
  },
  methods: {
    // 解答入力されているかチェック
    activateSubmit() {
      if(this.myAnswer.length > 0) {
        this.submitDisabled = false;
      } else {
        this.submitDisabled = true;
      }
    },

    // オーライしたとき
    submitMyAnswer() {
      // 入力された答え
      const answer = this.myAnswer;
      // 残選択肢に存在するかチェック
      const isCorrect = this.stationRemaining.some(item => item === answer);
      // 全選択肢にはあったかチェック（おしい）
      const isClose = this.stationAll.some(item => item === answer);
      let msg;

      // 入力エリアを空にしておく
      this.myAnswer = '';

      if(isCorrect) { // 残選択肢にあれば
        // 解答履歴配列に追加
        this.answerHistory.push({'human': true, 'content': answer});
        // 解答された選択肢を消す
        this.stationRemaining = this.stationRemaining.filter(item => item !== answer);
      } else if(isClose) { // 残選択肢にはないが全選択肢にはあれば
        msg = answer + 'はもうでたよ';
      } else { // 残選択肢になければ
        msg = answer + 'はないよ';
      }

      // メッセージ表示
      this.msg = msg;
    }
  }
}
