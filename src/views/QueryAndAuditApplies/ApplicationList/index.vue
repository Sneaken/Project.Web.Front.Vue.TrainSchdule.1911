<template>
  <div>
    <el-table
      ref="singleTable"
      v-loading="loading"
      :data="formatedList"
      highlight-current-row
      stripe
      header-align="center"
      @row-dblclick="showDetail"
    >
      <el-table-column type="selection" />
      <el-table-column label="基本">
        <template slot-scope="{row}">
          <div>
            <el-tag
              v-if="row.request.vacationType"
              effect="dark"
              :type="row.request.vacationType==='正休'?'':'danger'"
            >{{ row.request.vacationType }}</el-tag>
            <el-link
              :href="`#/user/profile?id=${row.userBase.id}`"
              target="_blank"
            >{{ row.userBase.realName }}</el-link>
            <el-tooltip content="用户原姓名">
              <span v-if="row.userBase.realName!=row.base.realName">({{ row.base.realName }})</span>
            </el-tooltip>
          </div>
          <div :style="{'font-size':'0.8rem',margin:'2px',color:'#3f3f3f'}">
            <el-link
              :href="`#/dashboard?companyCode=${row.userBase.companyCode}`"
              target="_blank"
            >{{ getCDdes(row.userBase,row.base) }}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审批流程">
        <template slot-scope="{row}">
          <ApplyAuditStreamPreview
            slot="content"
            :audit-status="row.steps"
            :title="row.auditStreamSolution"
            :now-step="row.nowStep?row.nowStep.index:row.steps.length"
          />
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="休假时间">
        <template slot-scope="{row}">
          <el-row>
            <el-tooltip :content="`创建于:${row.create}`">
              <span>{{ format(row.create, 'zh_CN') }}</span>
            </el-tooltip>
          </el-row>
          <el-row>
            <el-tooltip content="休假起始和结束的时间">
              <span>{{ row.stampLeave }}-{{ row.stampReturn }}</span>
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假地点">
        <template slot-scope="{row}">
          <el-tooltip
            :content="`详细地址:${row.request.vacationPlaceName?row.request.vacationPlaceName:'未填写'}`"
          >
            <span>{{ row.request.vacationPlace? row.request.vacationPlace.name :'未选择' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假总天数">
        <template slot-scope="{row}">
          <el-dropdown>
            <span class="el-dropdown-link">
              <span
                :style="{color:row.request.additialVacations&&row.request.additialVacations.length>0?'#3a3':'#333'}"
              >{{ datedifference(row.request.stampReturn,row.request.stampLeave) + 1 }}天</span>
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>正休假{{ row.request.vacationLength }}天</el-dropdown-item>
              <el-dropdown-item>路途{{ row.request.onTripLength }}天</el-dropdown-item>
              <el-dropdown-item
                v-for="additial in row.request.additialVacations"
                v-show="row.request.additialVacations.length>0"
                :key="additial.name"
              >
                <el-tooltip :content="additial.description" placement="left">
                  <el-tag>{{ additial.name }} {{ additial.length }}天</el-tag>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="{row}">
          <el-tooltip content="此申请可能为休假结束后创建">
            <el-tag v-if="row.checkIfIsReplentApply" color="#ff0000" class="white--text">补充申请</el-tag>
          </el-tooltip>
          <el-tag
            v-if="row.statusDesc"
            :color="row.statusColor"
            class="white--text"
          >{{ row.statusDesc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <slot :row="row" name="action" />
        </template>
      </el-table-column>
    </el-table>
    <AuditApplyMutilDialog
      :show.sync="multiAuditFormShow"
      :responselist="multiAuditFormSelection"
      @updated="$emit('updated')"
    />
    <el-button
      v-show="!multiAuditFormShow&&list.length>1"
      style="width:100%;font-size:1rem;letter-spacing:1.5rem"
      type="success"
      @click="showMutilAudit"
    >审批当前选中项</el-button>
    <Pagination
      :pagesetting.sync="pagesetting"
      :total-count="pagesTotalCount"
      :hidden="formatedList.length===0"
    />
  </div>
</template>
<script>
import { format } from 'timeago.js'
import AuditApplyMutilDialog from '../AuditApplyMutilDialog'
import { datedifference } from '@/utils'
import Pagination from '@/components/Pagination'
import ApplyAuditStreamPreview from '@/components/ApplicationApply/ApplyAuditStreamPreview'

export default {
  name: 'ApplicationList',
  components: {
    AuditApplyMutilDialog,
    Pagination,
    ApplyAuditStreamPreview
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    pages: {
      type: Object,
      default() {
        return {}
      }
    },
    pagesTotalCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      multiAuditFormShow: false,
      multiAuditFormSelection: [],
      formatedList: [] // 经过格式化过的主列表
    }
  },
  computed: {
    pagesetting: {
      get() {
        return this.pages
      },
      set(val) {
        this.$emit('update:pages', val)
      }
    },
    myUserid() {
      return this.$store.state.user.userid
    },
    statusOptions() {
      return this.$store.state.vacation.statusDic
    }
  },
  watch: {
    list: {
      handler(val) {
        this.formatedList = val.map(li => this.formatApplyItem(li))
      },
      deep: true
    }
  },
  methods: {
    format,
    getCDdes(row, prevRow) {
      const cn = row.companyName
      const prevCn = prevRow.companyName
      const dn = row.dutiesName
      const prevDn = prevRow.dutiesName
      const result = [cn, dn]
      if (cn !== prevCn || dn !== prevDn) {
        result.push('(')
        result.push(prevCn)
        result.push(prevDn)
        result.push(')')
      }
      return result.join(' ')
    },
    formatApplyItem(li) {
      const { ...item } = li
      const statusObj = this.statusOptions[item.status]
      item.statusDesc = statusObj ? statusObj.desc : '不明类型'
      item.statusColor = statusObj ? statusObj.color : 'gray'
      item.acessable = statusObj ? statusObj.acessable : []
      var stampLeave = new Date(item.request.stampLeave)
      item.checkIfIsReplentApply = stampLeave <= new Date(item.create)
      var nowYear = new Date().getFullYear()
      var nowYearDes =
        stampLeave.getFullYear() !== nowYear
          ? `${stampLeave.getFullYear()}年`
          : ''
      item.stampLeave = `${nowYearDes}${stampLeave.getMonth() +
        1}月${stampLeave.getDate()}日`
      var stampReturn = new Date(item.request.stampReturn)
      var stampReturnYearDes =
        stampReturn.getFullYear() !== nowYear
          ? `${stampReturn.getFullYear()}年`
          : ''
      item.stampReturn = `${stampReturnYearDes}${stampReturn.getMonth() +
        1}月${stampReturn.getDate()}日`
      return item
    },
    datedifference,
    countOtherTime(row) {
      return (
        datedifference(row.stampReturn, row.stampLeave) -
        row.onTripLength -
        row.vacationLength
      )
    },
    showMutilAudit() {
      this.multiAuditFormSelection = this.getChecked()
      this.multiAuditFormShow = true
    },
    getChecked() {
      return this.$refs['singleTable'].selection
    },
    showDetail(row, column, event) {
      if (column.label === '操作') return
      this.$router.push(`/application/applyDetail?id=${row.id}`)
    }
  }
}
</script>

<style lang='scss'>
</style>

