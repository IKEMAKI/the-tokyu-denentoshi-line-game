import dayjs from 'dayjs'

import Result from '~/components/battle/Result'

export default {
  components: {
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

      // タイムアタック
      time: {
        start: '',
        end: '',
        diff: '',
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
     * ゲーム開始時
     */
    startGame() {
      // 設定に基づき選択肢を生成
      switch(this.config.mode) {
        // モード: すべての駅
        case 'all':
          this.sta.all = this.sta.express.concat(this.sta.local);
          break;
        // モード: 急行
        case 'express':
          this.sta.all = this.sta.express;
          break;
        // モード: 各駅
        case 'local':
          this.sta.all = this.sta.local;
          break;
        // 念の為デフォルトはすべての駅とする
        default:
          this.sta.all = this.sta.express.concat(this.sta.local);
      }

      // 残選択肢
      this.sta.remaining = this.sta.all;

      // cpu知識
      let numCpuKnowledge = 0;
      switch(this.config.difficulty) {
        // 難易度: ふつう
        case 'normal':
          numCpuKnowledge = Math.round(this.sta.all.length / 2);
          this.sta.cpu = this.makeCPUKnowledge(this.sta.all, numCpuKnowledge);
          break;
        // 難易度: 神
        case 'god':
          this.sta.cpu = this.sta.all;
          break;
        // 念の為デフォルトはふつうとする
        default:
          numCpuKnowledge = Math.round(this.sta.all.length / 2);
          this.sta.cpu = this.makeCPUKnowledge(this.sta.all, numCpuKnowledge);
      }

      // フェーズ進行
      this.phase = 1;
      // 開始時間保存
      this.time.start = dayjs();

      // 問題数が偶数ならCPUからスタート
      // （プレイヤーで終わるようにする）
      if((this.sta.all.length % 2 === 0)) {
        this.processCPUTurn();
      } else {
        // 奇数ならプレイヤーのターン
        // 入力可能にする
        this.isEnabled.input = true;
      }
    },

    /**
     * cpuの知識生成
     * @param {array} array 全駅のデータ
     * @param {number} count 知識の数
     * @return {array} cpuの知識を配列で返す
     */
    makeCPUKnowledge(array, count) {
      const result = [];
      for(let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * ((array.length - 1)));
        if(result.some(item => item === array[randomIndex])) {
          i--;
        } else {
          result[i] = array[randomIndex];
        }
      }
      return result;
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
      const isCorrect = this.sta.remaining.some(item => item === answer);
      // 全選択肢にはあったかチェック（おしい）
      const isClose = this.sta.all.some(item => item === answer);

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
      this.sta.remaining = this.sta.remaining.filter(item => item !== ans);
      this.sta.cpu = this.sta.cpu.filter(item => item !== ans);

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
      if(this.sta.cpu.length < 1) {
        // ゲーム終了処理へ
        this.endGame();
      } else {
        // あればランダムで選んで解答
        const choice = this.sta.cpu[Math.floor(Math.random() * (this.sta.cpu.length))];
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
      this.time.end = dayjs();
      this.time.diff = dayjs(this.time.end).diff(this.time.start, 'second', true);
      // フェーズ進行
      this.phase = 2;
    },
  }
}
