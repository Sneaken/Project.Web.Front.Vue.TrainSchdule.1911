<template>
  <el-popover trigger="hover" @show="loadQrCode">
    <el-form label-width="60px">
      <el-form-item label="创建于">
        <span>{{ innerData.create }}</span>
      </el-form-item>
      <el-form-item label="有效期">
        <span>{{ innerData.expire }}</span>
      </el-form-item>
      <el-form-item label="创建人">
        <UserFormItem :userid="innerData.createBy" />
      </el-form-item>
      <ContactMe v-if="hasShow" :content="url" description="扫码访问" />
    </el-form>
    <el-link slot="reference" :href="url">{{ innerData.urlKey }}</el-link>
  </el-popover>
</template>

<script>
import UserFormItem from '@/components/User/UserFormItem'
import ContactMe from '@/components/ContactMe'
import { loadDwz } from '@/api/common/dwz'
export default {
  name: 'ShortUrl',
  components: { UserFormItem, ContactMe },
  props: {
    urlKey: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      innerData: {
        urlKey: '',
        create: '',
        createBy: '',
        target: '',
        expire: ''
      },
      hasShow: false
    }
  },
  computed: {
    url() {
      return `${process.env.VUE_APP_BASE_API}/s/${this.innerData.urlKey}`
    }
  },
  watch: {
    urlKey: {
      handler(val) {
        if (val) {
          loadDwz({
            key: val,
            pages: { pageIndex: 0, pageSize: 1 }
          }).then(data => {
            if (data.list.length === 0) return
            var item = data.list[0]
            this.innerData = item
            this.innerData.urlKey = item.key
          })
        }
      },
      immediate: true
    },
    data: {
      handler(val) {
        if (val) {
          this.innerData = val
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadQrCode() {
      if (this.hasShow) return
      this.hasShow = true
    }
  }
}
</script>

<style>
</style>
