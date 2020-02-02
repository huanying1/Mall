<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" class="detail-nav" ref="nav"/>
    <scroll class="content"
    ref="scroll"
    :probe-type="3"
    @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComp/DetailNavBar";
  import DetailSwiper from "./childComp/DetailSwiper";
  import DetailBaseInfo from "./childComp/DetailBaseInfo";
  import DetailShopInfo from "./childComp/DetailShopInfo";
  import DetailGoodsInfo from "./childComp/DetailGoodsInfo";
  import DetailParamInfo from "./childComp/DetailParamInfo";
  import DetailCommentInfo from "./childComp/DetailCommentInfo";
  import DetailBottomBar from "./childComp/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";

  import {itemListenerMixin, backTopMixin} from "common/mixin";
  // import {debounce} from "../../common/utils"

  import { mapActions } from 'vuex'


  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
  },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid

      //2.请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result

        //1.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages

        //2.获取商品数据
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //2.获取店铺信息
        this.shop = new Shop(data.shopInfo)

        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        //5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        this.$nextTick(() => {
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)
        })

        // this.getThemeTopY = debounce(() => {
        //     this.themeTopYs = []
        //     this.themeTopYs.push(0)
        //     this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //     this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //     this.themeTopYs.push(Number.MAX_VALUE)
        //     console.log(this.themeTopYs);
        // },100)
      })

      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

    },
    mounted() {

    },
    deactivated() {
      this.$bus.$off('itemImgLoad', this.ItemImgListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        const positionY = -position.y
        let length = this.themeTopYs.length
        for(let i = 0; i < length-1; i++)

          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i]
          && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
            //判断BackTop是否显示
            this.listenShowBackTop(position)
        },
      addToCart() {
        //1.获取购物车商品需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc  = this.goods.desc
        product.price = this.goods.realPrice
        product.iid   = this.iid

        //2.将商品加入购物车
        this.addCart(product).then(res => {
          // this.show = true
          // this.message = res
          // clearTimeout(timer)
          // const timer = setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // },1500)
          this.$toast.showAlert(res, 1500)
        })

      }
    }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 99;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100vh - 93px);
  }

</style>
