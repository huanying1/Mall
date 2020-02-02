<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">合计：{{totalPrice}}</div>

    <div class="calculate" @click="calcClick">去结算：{{checkLength}}</div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  import { mapGetters } from 'vuex'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
  computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
    checkLength() {
        return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if(this.cartList.length === 0) return false
      return this.cartList.every(item => item.checked)
    }
  },
    methods: {
      checkClick() {
        if(this.isSelectAll) { //当全部选中时
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if (!this.isSelectAll) {
          this.$toast.showAlert('请选择购买的商品', 2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    background-color: #eee;
    height: 40px;
    line-height: 40px;
  }

  .check-content{
    display: flex;
    align-items: center;
    -webkit-flex: 1;
    flex: 1;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin: 0 10px;
  }

  .price {
    margin-left: 20px;
    -webkit-flex: 3;
    flex: 2;
  }

  .calculate {
    text-align: center;
    background-color: deeppink;
    color: #fff;
    -webkit-flex: 1.5;
    flex: 1.5;
  }
</style>
