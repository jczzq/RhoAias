<style lang="scss">
  #layout-default {
    >.main-view {
      margin-top: $nav-height;
    }
  }
</style>

<template>
  <div id="layout-default">
    <v-header></v-header>
    <router-view class="main-view"></router-view>
    <div class="hr"></div>
    <v-footer></v-footer>
    <no-ssr>
      <creator-menu></creator-menu>
    </no-ssr>
    <image-reader></image-reader>
  </div>
</template>

<script>
  import vHeader from '~/components/layouts/Header'
  import vFooter from '~/components/layouts/Footer'
  import ImageReader from '~/components/common/ImageReader'
  import CreatorMenu from '~/components/common/Creator'

  export default {
    components: {
      vHeader, vFooter, ImageReader, CreatorMenu
    }
  }
</script>
