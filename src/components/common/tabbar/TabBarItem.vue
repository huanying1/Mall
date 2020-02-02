<template>
  <div>
      <div class="tab-bar-item" @click="itemClick">
          <div v-if="!isActive"><slot name="item_icon"></slot></div>
          <div v-else><slot name="item_icon_active"></slot></div>
          <div :style="activeStyle"><slot name="item_text"></slot></div>
      </div>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    props: {
      path: String,
      activeColor: {
        type: String,
        default: 'deeppink'
      }
    },
    data() {
      return {

      }
    },
    computed: {
      isActive() {
        // /home -> item1(/home) =true
        return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle() {
        return this.isActive ? {color: this.activeColor} : {}
      }
    },
    methods: {
      itemClick() {
        this.$router.replace(this.path)
        if(this.$router.history.current.path !== this.path){
          this.$router.replace(this.path)
        }
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item {
    text-align: center;
    width: 25vw;
    flex: 1;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
</style>
