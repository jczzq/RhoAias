import Api from '~/api/bangumiApi'
import CartoonRoleApi from '~/api/cartoonRoleApi'

export default {
  namespaced: true,
  state: () => ({
    follows: Object.create(null),
    released: [],
    timeline: {
      data: [],
      year: new Date().getFullYear() + 1,
      take: 5,
      min: 0,
      noMore: false
    },
    category: {
      data: [],
      noMore: false,
      page: 1,
      take: 15
    },
    tags: [],
    info: null,
    posts: {
      data: [],
      total: 0,
      noMore: false
    },
    videos: {
      data: [],
      total: 0,
      fetched: false
    },
    roles: {
      id: 0,
      data: [],
      noMore: false
    }
  }),
  mutations: {
    selectTag (state, index) {
      const tag = state.tags[index]
      tag.selected = !tag.selected
      state.tags[index] = tag
    },
    ADD_ROLE_STATE (state, { roleId, hasStar }) {
      state.roles.data.forEach((item, index) => {
        if (item.id === roleId) {
          if (hasStar) {
            state.roles.data[index].has_star++
          } else {
            state.roles.data[index].has_star = 1
            state.roles.data[index].fans_count++
          }
          state.roles.data[index].star_count++
        }
      })
    },
    SET_FOLLOW (state, { followed, self }) {
      state.info.followed = followed
      followed ? state.info.count_like++ : state.info.count_like--
      if (followed) {
        state.info.followers.unshift(self)
      } else {
        state.info.followers.forEach((user, index) => {
          if (user.zone === self.zone) {
            state.info.followers.splice(index, 1)
          }
        })
      }
    },
    SET_RELEASED (state, data) {
      state.released = data
    },
    SET_TIMELINE (state, data) {
      const temp = state.timeline
      const nowYear = temp.year - temp.take
      state.timeline = {
        data: temp.data.concat(data.list),
        min: data.min,
        take: temp.take,
        year: nowYear,
        noMore: nowYear <= data.min
      }
    },
    SET_TAGS (state, { tags, id }) {
      const ids = id ? id.split('-') : undefined
      tags.forEach((tag, index) => {
        tags[index].selected = ids ? ids.indexOf(tag.id.toString()) !== -1 : false
      })
      state.tags = tags
    },
    SET_CATEGORY (state, data) {
      state.category.data = state.category.data.concat(data.list)
      state.category.noMore = data.list.length < state.category.take
      state.category.page++
    },
    SET_POSTS (state, { data, total, reset }) {
      const posts = reset ? data : state.posts.data.concat(data)
      state.posts = {
        data: posts,
        total: total,
        noMore: posts.length >= total
      }
    },
    SET_BANGUMI (state, data) {
      state.info = data
    },
    SET_VIDEOS (state, data) {
      state.videos = {
        data: data.videos,
        total: data.total,
        fetched: true
      }
    },
    SET_ROLES (state, { data, bangumiId }) {
      state.roles.data = state.roles.data.concat(data)
      state.roles.noMore = true
      state.roles.id = bangumiId
    }
  },
  actions: {
    async getTags ({ state, commit }, { id, ctx }) {
      if (state.tags.length) {
        return
      }
      const api = new Api(ctx)
      const tags = await api.tags()
      tags && commit('SET_TAGS', { tags, id })
    },
    async getBangumi ({ commit }, { ctx, id }) {
      const api = new Api(ctx)
      const data = await api.show(id)
      data && commit('SET_BANGUMI', data)
    },
    async getVideos ({ commit }, { id, ctx }) {
      const api = new Api(ctx)
      const data = await api.videos(id)
      data && commit('SET_VIDEOS', data)
    },
    async getRoles ({ state, commit }, { bangumiId, ctx }) {
      if (state.roles.id === bangumiId) {
        return state.roles.data
      }
      const api = new Api(ctx)
      const data = await api.roles({ bangumiId })
      if (data) {
        commit('SET_ROLES', { data, bangumiId })
        return data
      }
    },
    async follow ({ commit, rootState }, { ctx, id }) {
      const api = new Api(ctx)
      const followed = await api.follow(id)
      commit('SET_FOLLOW', {
        followed,
        self: {
          id: rootState.user.id,
          zone: rootState.user.zone,
          avatar: rootState.user.avatar,
          nickname: rootState.user.nickname
        }
      })
    },
    async getReleased ({ state, commit }, ctx) {
      if (state.released.length) {
        return
      }
      const api = new Api(ctx)
      const data = await api.released()
      data && commit('SET_RELEASED', data)
    },
    async getTimeline ({ state, commit }, ctx) {
      if (state.timeline.noMore) {
        return
      }
      const api = new Api(ctx)
      const data = await api.timeline({
        year: state.timeline.year,
        take: state.timeline.take
      })
      data && commit('SET_TIMELINE', data)
    },
    async getCategory ({ state, commit }, { id, ctx }) {
      const api = new Api(ctx)
      const data = await api.category({
        id,
        page: state.category.page,
        take: state.category.take
      })
      data && commit('SET_CATEGORY', data)
    },
    async getPosts ({ state, commit }, { id, take, type, ctx, reset = false }) {
      const seenIds = reset ? null : state.posts.data.length
        ? state.posts.data.map(item => item.id).join(',')
        : null
      const api = new Api(ctx)
      const data = await api.posts({ id, take, type, seenIds })
      data && commit('SET_POSTS', {
        data: data.list,
        total: data.total,
        reset
      })
    },
    async starRole ({ commit }, { bangumiId, roleId, ctx, hasStar }) {
      const api = new CartoonRoleApi(ctx)
      try {
        await api.star({ bangumiId, roleId })
        commit('ADD_ROLE_STATE', { roleId, hasStar })
      } catch (e) {}
    }
  },
  getters: {}
}
