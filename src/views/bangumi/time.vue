<style lang="scss">
  #bangumi-timeline {
    #collections {
      padding-top: 20px;
      padding-bottom: 5px;

      .collection {
        display: block;

        .time {
          position: relative;
          font-weight: 400;
          color: $color-text-light;
          font-size: 16px;
          margin-bottom: 15px;
          padding-left: 12px;

          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 2px;
            height: 14px;
            width: 3px;
            background-color: $color-blue-normal;
            border-radius: 3px;
          }
        }

        $bangumi-height: 60px;
        .bangumi {
          margin-bottom: 10px;
          height: $bangumi-height;

          .face {
            width: $bangumi-height;
            height: $bangumi-height;
            flex-shrink: 0;
            margin-right: 15px;
            display: block;
            border-radius: 5px;
            float: left;
          }

          .content {
            overflow: hidden;

            .name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 8px;
            }

            .body {
              color: $color-text-light;
              font-size: 13px;
              @include twoline(18px)
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div id="bangumi-timeline">
    <div class="tabs">
      <router-link :to="$alias.bangumiNews">新番放送</router-link>
      <router-link :to="$alias.bangumiTimeline" class="active">时间轴</router-link>
      <router-link :to="$alias.bangumiTag()">分类索引</router-link>
    </div>
    <ul id="collections" class="container">
      <ul v-for="col in timeline.data" :key="col.date" class="collection">
        <h3 class="time" v-text="col.date"></h3>
        <li class="bangumi" v-for="item in col.list" :key="item.id">
          <router-link :to="$alias.bangumi(item.id)">
            <v-img
              class="face"
              :title="item.name"
              :alt="item.name"
              :src="$resize(item.avatar, { width: 120 })">
            </v-img>
            <div class="content">
              <p class="name" v-text="item.name"></p>
              <p class="body" v-text="item.summary"></p>
            </div>
          </router-link>
        </li>
      </ul>
    </ul>
    <more-btn
      :no-more="timeline.noMore"
      :loading="loading"
      @fetch="loadMore"
    ></more-btn>
  </div>
</template>

<script>
  export default {
    name: 'bangumi-time',
    async asyncData ({ store, ctx }) {
      await store.dispatch('bangumi/getTimeline', ctx)
    },
    computed: {
      timeline () {
        return this.$store.state.bangumi.timeline
      }
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      async loadMore () {
        if (this.loading) {
          return
        }
        this.loading = true
        try {
          await this.$store.dispatch('bangumi/getTimeline')
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
