<template>
  <div>
    <el-tooltip>
      <template slot="content">
        <span>点击链接选择成员</span>
        <span style="cursor:pointer" @click="clearSelect">清空</span>
      </template>
      <el-link type="info" @click="dialogVisible=true">
        <span @mouseenter="forgetHasShow=true">{{ userRealName?userRealName:defaultInfo }}</span>
      </el-link>
    </el-tooltip>
    <el-dialog v-if="forgetHasShow" title="搜索成员" :visible.sync="dialogVisible" append-to-body>
      <FindUserByRealName v-model="nowUserCode" :avatar.sync="avatar" @change="selectUserChanged" />
    </el-dialog>
  </div>
</template>

<script>
import FindUserByRealName from '@/components/User/FindUserByRealName'
export default {
  name: 'UserSelector',
  components: { FindUserByRealName },
  model: {
    prop: 'code',
    event: 'change'
  },
  props: {
    code: {
      type: String,
      default: null
    },
    defaultInfo: {
      type: String,
      default: '搜索成员'
    }
  },
  data: () => ({
    forgetHasShow: false,
    dialogVisible: false,
    userRealName: null,
    avatar: null
  }),
  computed: {
    nowUserCode: {
      get() {
        return this.code
      },
      set(val) {
        this.$emit('update:code', val)
      }
    }
  },
  watch: {
    avatar: {
      handler(val) {
        this.$emit('update:avatar', val)
      }
    }
  },
  methods: {
    clearSelect() {
      this.userRealName = null
      this.nowUserCode = null
      this.$emit('change', null)
    },
    selectUserChanged(u) {
      if (u) {
        this.userRealName = `${u.realName}(${u.id})`
      }
      this.nowUserCode = u.id
      this.$emit('change', u)
    }
  }
}
</script>

<style>
</style>
