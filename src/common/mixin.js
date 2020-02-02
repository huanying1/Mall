import {debounce} from "common/utils";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      ItemImgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 300)

    this.ItemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImgLoad', this.ItemImgListener)
  },
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenShowBackTop(position) {
      //1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
