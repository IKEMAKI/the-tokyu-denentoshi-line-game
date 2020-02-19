<doc>難易度・モード設定</doc>

<template lang="pug">
div
  dl
    dt.term 難易度を選んでね
    dd
      ul.list
        li.item
          label.parts-radio-label
            input.parts-radio-input(type="radio" value="normal" v-model="pass.config.difficulty")
            span.parts-radio-tx ふつう
        li.config-item
          label.parts-radio-label
            input.parts-radio-input(type="radio" value="god" v-model="pass.config.difficulty" class="radio")
            span.parts-radio-tx 神

    dt.term モードを選んでね
    dd
      ul.list
        li.item
          label.parts-radio-label
            input.parts-radio-input(type="radio" value="all" v-model="pass.config.mode")
            span.parts-radio-tx すべての駅
        li.item
          label.parts-radio-label
            input.parts-radio-input(type="radio" value="express" v-model="pass.config.mode")
            span.parts-radio-tx 急行停車駅のみ
        li.item
          label.parts-radio-label
            input.parts-radio-input(type="radio" value="local" v-model="pass.config.mode")
            span.parts-radio-tx 急行に飛ばされる駅のみ
  button.parts-btn(type="button" @click="startGame()") はじめる
</template>

<style lang="stylus" scoped>
// 選んでね
.term
  font-size 1.8rem
  margin-top 1.5em

.list
  margin .5em 0 0 2em

.item + .item
  margin-top .3em

// スタートボタン
.parts-btn
  margin-top 1.5em
</style>

<script>
export default {
  // 親から必要な情報受取
  // sta, config, time
  props: {
    'pass': {
      type: Object,
      require: true
    }
  },
  methods: {
    /**
     * ゲーム開始時
     */
    startGame() {
      // 設定に基づき選択肢を生成
      switch(this.pass.config.mode) {
        // モード: すべての駅
        case 'all':
          this.$parent.sta.all = this.pass.sta.express.concat(this.pass.sta.local);
          break;
        // モード: 急行
        case 'express':
          this.$parent.sta.all = this.pass.sta.express;
          break;
        // モード: 各駅
        case 'local':
          this.$parent.sta.all = this.pass.sta.local;
          break;
        // 念の為デフォルトはすべての駅とする
        default:
          this.$parent.sta.all = this.pass.sta.express.concat(this.pass.sta.local);
      }

      // 残選択肢
      this.$parent.sta.remaining = this.pass.sta.all;

      // cpu知識
      let numCpuKnowledge = 0;
      switch(this.pass.config.difficulty) {
        // 難易度: ふつう
        case 'normal':
          numCpuKnowledge = Math.round(this.pass.sta.all.length / 2);
          this.$parent.sta.cpu = this.makeCPUKnowledge(this.pass.sta.all, numCpuKnowledge);
          break;
        // 難易度: 神
        case 'god':
          this.$parent.sta.cpu = this.pass.sta.all;
          break;
        // 念の為デフォルトはふつうとする
        default:
          numCpuKnowledge = Math.round(this.pass.sta.all.length / 2);
          this.$parent.sta.cpu = this.makeCPUKnowledge(this.pass.sta.all, numCpuKnowledge);
      }

      // フェーズ進行
      this.$parent.phase = 1;
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
  }
}
</script>
