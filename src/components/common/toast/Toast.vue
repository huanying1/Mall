<template>
  <div class="toast" v-show="isShow">
    <div>{{Tips}}</div>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    props: {
      message: {
        type: String,
        default: ''
      },
      show: {
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        Tips: '',
        isShow: false
      }
    },
    methods: {
      showAlert(message='默认文字', duration = 1500) {
        this.isShow = true
        this.Tips = message

        setTimeout(() => {
          this.isShow = false
          this.Tips = ''
        },duration)
      }
    }
  }
</script>

<style scoped>
  .toast {
    padding: 8px 10px;
    position: fixed;
    top:50vh;
    left:50vw;
    transform: translate(-50%, -50%);
    background-color: rgba(0,0,0,.5);
    color: #fff;
    border-radius: 5%;
    font-size: 20px;
    text-align: center;
    z-index: 99;
  }
</style>
