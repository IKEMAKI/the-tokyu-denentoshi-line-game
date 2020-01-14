export default {
  data() {
    return {
      stationAll: [],
      stationRemaining: [],
      stationExpress: ['中央林間', '南町田グランベリーパーク', '長津田'],
      stationLocal: ['つきみ野', 'すずかけ台', 'つくし野'],

      myAnswer: '',

      CPUKnowledge: [],

      answerHistory: [],

      msg: '',

      // オーライボタン発車・入力可能
      isEnabledSubmit: false,
      isEnabledInput: false,
    }
  },
  created() {
    // ゲームに使われる全駅の配列を作成しておく
    this.stationAll = this.stationExpress.concat(this.stationLocal);

    // こちらは解答できる残選択肢の駅名配列
    this.stationRemaining = this.stationAll;

    // 今回のCPUが知っている駅名をランダム生成
    this.CPUKnowledge = this.makeCPUKnowledge(this.stationAll, this.stationAll.length / 2);
  },
  computed: {
    // 解答入力されているかチェック
    activateSubmit() {
      let state;
      if(this.myAnswer.length > 0) {
        state = true;
      } else {
        state = false;
      }
      this.isEnabledSubmit = state;
    },
  },
  methods: {
    // cpuの選択肢を生成
    makeCPUKnowledge(array, count) {
      const arr = array;
      const num = count;
      const result = [];
      for(let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * ((arr.length - 1)));
        if(result.some(item => item === arr[randomIndex])) {
          i--;
        } else {
          result[i] = arr[randomIndex];
        }
      }
      return result;
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
        this.CPUKnowledge = this.CPUKnowledge.filter(item => item !== answer);
        // 相手のターン
        this.processCPUTurn();
      } else if(isClose) { // 残選択肢にはないが全選択肢にはあれば
        msg = answer + 'はもうでたよ';
      } else { // 残選択肢になければ
        msg = answer + 'はないよ';
      }

      // メッセージ表示
      this.msg = msg;
    },

    // 相手のターン
    processCPUTurn() {
      // 入力・送信禁止
      this.isEnabledInput = false;
      this.isEnabledSubmit = false;
    }
  }
}
