<style lang="scss">
  #header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: $nav-height;
    line-height: $nav-height;
    box-shadow: 0 2px 4px rgba(0,0,0,.1);
    background-color: #ffffff;
    z-index: 90;

    .logo {
      height: 28px;
      margin-top: ($nav-height - 28) / 2;
      display: block;
      float: left;

      img {
        height: 100%;
        width: auto;
      }
    }

    .header-right {
      text-align: right;
      overflow: hidden;
      height: 100%;
      font-size: 0;

      .search-btn {
        display: inline-block;
        vertical-align: middle;
        margin-left: 24px;
        margin-top: 2px;

        i {
          font-size: 24px;
          line-height: 24px;
        }
      }

      .nav-avatar {
        position: relative;
        margin-left: 15px;
        display: inline-block;
        vertical-align: middle;
        @include avatar(24px);
        @include border($color-gray-normal, 50%);

        .badge {
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: red;
          @include border(#fff, 50%);
        }
      }

      .faker-avatar {
        margin-left: 15px;
        width: 24px;
        height: 24px;
        font-size: 23px;
        line-height: 24px;
        vertical-align: middle;
        color: #333;
      }
      .show {
        transform: translateY(0) !important;
      }
      .search-drawer {
        border-radius: 0 0 5px 5px;
        transform: translateY(-50px);
        $search-height: 24px;

        .search-wrap {
          margin-top: 8px;
          margin-bottom: 8px;
          height: $search-height;
          line-height: $search-height;
          font-size: 12px;
          
          .cancel {
            float: right;
            padding-top: 5px;
            padding-left: 10px;
          }

          .content {
            overflow: hidden;
            background-color: #f4f4f4;
            border-radius: 4px;

            .iconfont {
              float: left;
              margin: 0 10px;
            }

            .clear {
              display: block;
              float: right;
              margin: 5px 10px;
              width: 14px;
              height: 14px;
              text-align: center;
              line-height: 13px;
              font-size: 12px;
              background-color: #999;
              color: #fff;
              border-radius: 50%;
              user-select: none;
            }

            .input-wrap {
              height: 100%;
              overflow: hidden;

              input {
                height: $search-height;
                background-color: transparent;
              }
            }
          }
        }
      }

      .user-drawer {
        text-align: left;

        .user-section {
          height: 110px;
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: $container-padding;
          text-shadow: 0 1px 10px gray;
          color: #ffffff;

          .bg {
            @include filter-blur();
            width: 120%;
            height: 120%;
            position: absolute;
            left: -10%;
            top: -10%;
            z-index: -1;
            background-color: #999;
          }
          
          .avatar {
            position: relative;
            display: block;
            @include avatar(50px);
            @include border(#fff, 50%);
            float: left;
            margin-right: 10px;
          }

          .panel {
            overflow: hidden;
            line-height: 25px;

            button {
              @include btn-empty(#ffffff);
            }
          }

          .badge {
            margin-right: 30px;
            font-size: 14px;
          }
        }

        .routes {
          margin-top: 10px;

          li {
            height: 40px;
            position: relative;
            padding: 5px 0;
            margin-left: 3px;
            @include border-bottom();
          }

          i {
            font-size: 13px;
          }

          a, button {
            display: block;
            width: 100%;
            height: 100%;
            line-height: 30px;
            text-align: left;
            font-size: 13px;
            color: #333;
          }
          .badge-count {
            border-radius: 12px;
            font-size: 15px;
            padding: 2px 8px;
            background-color: red;
            color: #fff;
            height: 20px;
            line-height: 16px;
            margin-left: 5px;
          }
        }
      }
    }
  }
</style>

<template>
  <header id="header" class="container">
    <router-link class="logo" to="/">
      <img :src="$resize(`${$cdn.image}owner/logo`, { height: 56, mode: 2 })" alt="logo">
    </router-link>
    <div class="header-right">
      <button class="search-btn" @click="openSDHandle">
        <i class="iconfont icon-sousuo"></i>
      </button>
      <v-drawer
        from="top"
        size="40px"
        id="search"
        class="search-drawer"
        :class="{ show: openSearchDrawer }"
        :value="true"
      >
        <div class="container">
          <div class="search-wrap">
            <button class="cancel" @click="openSearchDrawer = false">取消</button>
            <div class="content">
              <i class="iconfont icon-sousuo"></i>
              <span class="clear" @click="q = ''" v-show="q">×</span>
              <form method="get" action="#" @submit.prevent="search()" class="input-wrap">
                <input
                  id="searchInput"
                  type="search"
                  v-model.trim="q"
                  placeholder="搜索番剧"
                  ref="searchInput"
                >
              </form>
            </div>
          </div>
        </div>
      </v-drawer>
      <template v-if="$store.state.login">
        <button class="nav-avatar" @click="openUserDrawer">
          <img :src="$resize(avatar, { width: 48 })" alt="avatar">
          <span class="badge" v-if="notificationCount"></span>
        </button>
        <v-drawer
          from="right"
          size="70%"
          id="user"
          v-model="switchUserDrawer"
          class="user-drawer"
        >
          <div class="user-section">
            <div class="bg" :style="computeUserDrawerBg"></div>
            <div>
              <router-link :to="$alias.user(user.zone)" class="avatar">
                <img :src="$resize(user.avatar, { width: 50 })" alt="me">
              </router-link>
              <div class="panel">
                <div>
                  <router-link class="oneline" :to="$alias.user(user.zone)" v-text="user.nickname"></router-link>
                </div>
                <button @click="handleDaySign">{{ daySigned ? '已签到' : '签到' }}</button>
              </div>
            </div>
            <span class="badge">金币：{{ coinCount }} 个</span>
            <span class="badge">邀请码：{{ user.id }}</span>
          </div>
          <ul class="routes container" @click="switchUserDrawer = false">
            <li>
              <router-link :to="$alias.user(user.zone)">
                <i class="iconfont icon-zhuye"></i>
                个人主页
              </router-link>
            </li>
            <li>
              <router-link to="/me/setting">
                <i class="iconfont icon-shezhi"></i>
                用户设置
              </router-link>
            </li>
            <li>
              <router-link to="/notification/list">
                <i class="iconfont icon-nitification"></i>
                消息通知
                <span v-if="notificationCount" class="badge-count">{{ notificationCount }}</span>
              </router-link>
            </li>
            <li>
              <router-link to="/about/hello">
                <i class="iconfont icon-bangzhu"></i>
                功能简介
              </router-link>
            </li>
            <li>
              <button @click="logout">
                <i class="iconfont icon-tuichu"></i>
                退出登录
              </button>
            </li>
          </ul>
        </v-drawer>
      </template>
      <button class="faker-avatar iconfont icon-avatar" @click="openSignDrawer" v-else></button>
    </div>
  </header>
</template>

<script>
  import UserApi from '~/api/userApi'
  import SearchApi from '~/api/searchApi'

  export default {
    name: 'v-header',
    computed: {
      avatar () {
        return this.$store.state.login
          ? this.user.avatar
          : `${this.$cdn.image}default/user-avatar`
      },
      computeUserDrawerBg () {
        if (this.user.banner.split('/default/user-banner').length > 1) {
          return {}
        }
        return { backgroundImage: `url(${this.$resize(this.user.banner, { height: 250, mode: 2 })})` }
      },
      user () {
        return this.$store.state.user
      },
      notificationCount () {
        const result = this.user.notification - this.$store.state.users.notifications.checked
        return result < 0 ? 0 : result
      },
      daySigned () {
        return this.user.daySign
      },
      coinCount () {
        return this.user.coin
      }
    },
    data () {
      return {
        signDayLoading: false,
        openSearchDrawer: false,
        switchUserDrawer: false,
        q: ''
      }
    },
    methods: {
      logout () {
        this.$cookie.remove('JWT-TOKEN')
        const api = new UserApi(this)
        api.logout()
        window.location.href = '/'
      },
      openSDHandle () {
        this.openSearchDrawer = true
        this.$refs.searchInput.focus()
      },
      async search (words) {
        const q = words || this.q
        if (!q.length) {
          return
        }
        this.$toast.loading('搜索中...')
        const api = new SearchApi()
        api.index({ q }).then((data) => {
          window.location = data || '/bangumi/news?from=search'
        }).catch(() => {
          window.location = '/bangumi/news?from=search'
        })
      },
      async handleDaySign () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.daySigned || this.signDayLoading) {
          return
        }
        this.signDayLoading = true

        try {
          await this.$store.dispatch('users/daySign', {
            ctx: this
          })
          this.$store.commit('SET_USER_INFO', {
            daySign: true,
            coin: this.coinCount + 1
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.signDayLoading = false
        }
      },
      openUserDrawer () {
        this.$store.dispatch('getNotification', this)
        this.switchUserDrawer = true
      },
      openSignDrawer () {
        this.$channel.$emit('sign-in')
      }
    }
  }
</script>
