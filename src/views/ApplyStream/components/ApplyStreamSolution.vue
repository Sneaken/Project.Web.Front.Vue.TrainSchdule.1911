<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>审批方案规则（筛选申请人审批方案）</h3>
        <el-button
          type="success"
          :icon="loading?'el-icon-loading':'el-icon-refresh-right'"
          circle
          style="float:right"
          @click="refresh"
        />
      </div>
      <el-table :data="data.allSolutionRule">
        <el-table-column
          label="优先"
          width="80px"
          sortable
          :sort-method="(a,b)=>a.priority-b.priority"
        >
          <template slot-scope="scope">
            <el-tooltip>
              <div slot="content">数字越大，则优先级越高</div>
              <div>{{ scope.row.priority }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-tooltip effect="light">
              <div slot="content">
                <h3>创建于{{ format(scope.row.create,'zh_CN') }}</h3>
                <div>{{ scope.row.description }}</div>
              </div>
              <div>{{ scope.row.name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <template slot-scope="scope">
            <div v-if="!scope.row.companies||scope.row.companies.length==0">
              <div v-if="scope.row.companyCodeLength.length>0 || scope.row.companyTags.length>0">
                <el-tooltip effect="light">
                  <div slot="content">
                    <el-form>
                      <el-form-item v-if="scope.row.companyCodeLength.length>0" label="代码长度">
                        <el-tag v-for="l in scope.row.companyCodeLength" :key="l">{{ l }}</el-tag>
                      </el-form-item>
                      <el-form-item v-if="scope.row.companyTags.length>0" label="单位类别">
                        <el-tag v-for="t in scope.row.companyTags" :key="t">{{ t }}</el-tag>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div>{{ scope.row.companyTags.length + scope.row.companyCodeLength.length }}条范围</div>
                </el-tooltip>
              </div>
              <el-tooltip v-else>
                <div slot="content">所有单位都将默认使用此方案</div>
                <el-tag>不限</el-tag>
              </el-tooltip>
            </div>
            <el-dropdown v-else-if="scope.row.companies.length>1">
              <div>{{ scope.row.companies[0].name }}等{{ scope.row.companies.length }}个单位</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="cmp in scope.row.companies" :key="cmp.id">
                  <CompanyFormItem :data="cmp" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <CompanyFormItem v-else :data="scope.row.companies[0]" />
          </template>
        </el-table-column>
        <el-table-column label="职务">
          <template slot-scope="scope">
            <div v-if="!scope.row.duties||scope.row.duties.length==0">
              <div style="float:left">
                <el-tooltip>
                  <div
                    slot="content"
                  >{{ scope.row.dutyIsMajor==2?'仅职务类型为主官的生效':scope.row.dutyIsMajor==1?'仅职务类型非主官的生效':'不论职务类型是否为主官都将生效' }}</div>
                  <el-tag>{{ scope.row.dutyIsMajor==2?'仅主官':scope.row.dutyIsMajor==1?'仅非主官':'不限' }}</el-tag>
                </el-tooltip>
              </div>

              <div style="float:left">
                <div v-if="scope.row.dutyTags.length>0">
                  <el-tooltip effect="light">
                    <div slot="content">
                      <el-tag v-for="t in scope.row.dutyTags" :key="t">{{ t }}</el-tag>
                    </div>
                    <el-tag>{{ scope.row.dutyTags.length }}种类别</el-tag>
                  </el-tooltip>
                </div>
                <el-tooltip v-else>
                  <div slot="content">所有职务都将默认使用此方案</div>
                  <div>不限类别</div>
                </el-tooltip>
              </div>
            </div>
            <el-dropdown v-else-if="scope.row.duties.length>1">
              <div>{{ scope.row.duties[0].name }}等{{ scope.row.duties.length }}个职务</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="duty in scope.row.duties" :key="duty.id">
                  <DutyFormItem :data="duty" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <DutyFormItem v-else :data="scope.row.duties[0]" />
          </template>
        </el-table-column>
        <el-table-column label="成员">
          <template slot-scope="scope">
            <div v-if="!scope.row.auditMembers||scope.row.auditMembers.length==0">
              <el-popover trigger="hover" content="所有成员都将默认使用此方案">
                <el-tag slot="reference">不限</el-tag>
              </el-popover>
            </div>
            <el-dropdown v-else-if="scope.row.auditMembers.length>1">
              <div>{{ scope.row.auditMembers[0].realName }}等{{ scope.row.auditMembers.length }}名成员</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="cmp in scope.row.auditMembers" :key="cmp.id">
                  <UserFormItem :data="cmp" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <UserFormItem v-else :data="scope.row.auditMembers[0]" />
          </template>
        </el-table-column>
        <el-table-column label="审批流方案">
          <template slot-scope="scope">
            <div>{{ scope.row.solutionName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="启用" width="100rem">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enable"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#999999"
              @change="handleEnableChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300rem">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit-outline"
              @click="showSolutionRuleDialog('edit',scope.row)"
            >编辑</el-button>
            <el-button
              type="info"
              icon="el-icon-circle-close"
              @click="showSolutionRuleDialog('delete',scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        plain
        type="success"
        icon="el-icon-circle-plus-outline"
        style="width:100%"
        @click="showSolutionRuleDialog('new')"
      >添加</el-button>
    </el-card>
    <el-dialog
      :visible.sync="newSolutionRuleDialogShow"
      :title="newRule.mode=='new'?'新增':newRule.mode=='edit'?'编辑':'删除'"
    >
      <el-form v-loading="newRule.loading" label-width="120px">
        <el-form-item label="启用">
          <el-switch
            v-model="newRule.enable"
            placeholder="方案规则是否生效"
            active-color="#13ce66"
            inactive-color="#999999"
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="newRule.name" placeholder="填入独一无二的名称" style="width:400px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newRule.description"
            placeholder="规则描述，可自定义"
            style="width:400px"
            type="textarea"
            autosize
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="newRule.priority" placeholder="值越大优先级越高" />
        </el-form-item>
        <el-form-item label="方案">
          <el-select v-model="newRule.solutionName" placeholder="满足条件时使用的审批流方案">
            <el-option
              v-for="item in data.allSolution"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="单位">
          <CompanySelector
            :code.sync="companySelect.code"
            :placeholder="companySelect.name"
            @select-change="companySelectChange"
          />
          <el-tag
            v-for="tag in newRule.companies"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleCompaniesSelectClose(tag)"
          >{{ newRule.companiesName[tag] }}</el-tag>
        </el-form-item>
        <el-form-item label="长度">
          <el-select v-model="newRule.companyCodeLength" multiple placeholder="单位代码的位数">
            <el-option v-for="item in 10" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="单位类型">
          <el-select
            v-model="newRule.companyTags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="单位类型选取，输入后按回车键确认"
          />
        </el-form-item>
        <el-form-item label="主官">
          <el-radio-group v-model="newRule.dutyIsMajor">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">仅主官</el-radio>
            <el-radio :label="2">仅非主官</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职务类型">
          <el-select
            v-model="newRule.dutyTags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="职务类型选取，输入后按回车键确认"
          />
        </el-form-item>
        <el-form-item label="休假申请来源">
          <UserSelector
            :code.sync="userSelect.code"
            :default-info="userSelect.realName?userSelect.realName:'搜索成员'"
            style="display:inline"
            @change="handleUserSelectChange"
          />
          <el-tag
            v-for="tag in newRule.auditMembers"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleAuditMembersSelectClosed(tag)"
          >{{ newRule.auditMembersRealName[tag] }}</el-tag>
        </el-form-item>
        <AuthCode :form.sync="newRule.auth" />
        <el-button-group style="width:100%">
          <el-button
            v-loading="newRule.loading"
            type="success"
            style="width:50%"
            @click="submitSolutionRule"
          >保存</el-button>
          <el-button
            v-loading="newRule.loading"
            type="danger"
            style="width:50%"
            @click="deleteSolutionRule"
          >删除</el-button>
        </el-button-group>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import CompanySelector from '@/components/Company/CompanySelector'
import AuthCode from '@/components/AuthCode'
import CompanyFormItem from '@/components/Company/CompanyFormItem'
import DutyFormItem from '@/components/Duty/DutyFormItem'
import UserFormItem from '@/components/User/UserFormItem'
import UserSelector from '@/components/User/UserSelector'
import { format } from 'timeago.js'
import {
  addStreamSolutionRule,
  editStreamSolutionRule,
  deleteStreamSolutionRule,
  buildFilter
} from '@/api/applyAuditStream'
export default {
  name: 'ApplyStreamSolution',
  components: {
    CompanyFormItem,
    DutyFormItem,
    UserFormItem,
    AuthCode,
    CompanySelector,
    UserSelector
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          allSolutionRule: [],
          allSolutionRuleDic: {},
          allSolution: [],
          allSolutionDic: {},
          allActionNode: [],
          allActionNodeDic: {}
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newSolutionRuleDialogShow: false,
      newRule: this.buildNewSolutionRule(),
      companySelect: {},
      userSelect: {}
    }
  },
  methods: {
    format,
    companySelectChange(val) {
      this.companySelect.name = val
      if (this.newRule.companies.indexOf(this.companySelect.code) > -1) {
        return this.$message.error(`${val}已被选中`)
      }
      this.newRule.companies.push(this.companySelect.code)
      this.newRule.companiesName[this.companySelect.code] = val
    },
    handleUserSelectChange(val) {
      this.userSelect.realName = val.value
      if (this.newRule.auditMembers.indexOf(val.id) > -1) {
        return this.$message.error(`${val.value}已被选中`)
      }
      this.newRule.auditMembers.push(val.id)
      this.newRule.auditMembersRealName[val.id] = val.value
    },
    handleCompaniesSelectClose(tag) {
      this.newRule.companies.splice(this.newRule.companies.indexOf(tag), 1)
    },
    handleAuditMembersSelectClosed(tag) {
      this.newRule.auditMembers.splice(
        this.newRule.auditMembers.indexOf(tag),
        1
      )
    },
    refresh() {
      this.$emit('refresh')
    },
    deleteSolutionRule(row) {
      if (this.newRule.loading) return this.$message.info('加载中')
      this.newRule.loading = true
      var auth = this.newRule.auth
      if (!auth) {
        auth = {}
      }
      deleteStreamSolutionRule(this.newRule.name, auth.authByUserId, auth.code)
        .then(() => {
          this.$message.success(`${this.newRule.name}已删除`)
          this.newSolutionRuleDialogShow = false
          this.refresh()
        })
        .finally(() => {
          this.newRule.loading = false
        })
    },
    handleEnableChange(target) {
      this.showSolutionRuleDialog('edit', target)
      this.newSolutionRuleDialogShow = false
      this.submitSolutionRule()
    },
    showSolutionRuleDialog(mode, target) {
      this.newSolutionRuleDialogShow = true
      this.newRule.mode = mode
      if (target) {
        Object.assign(this.newRule, target)
        this.newRule.companiesName = {}
        this.newRule.companies.forEach(i => {
          this.newRule.companiesName[i.code] = i.name
        })
        this.newRule.companies = this.newRule.companies.map(i => i.code)

        this.newRule.dutiesName = {}
        this.newRule.duties.forEach(i => {
          this.newRule.dutiesName[i.code] = i.name
        })
        this.newRule.duties = this.newRule.duties.map(i => i.code)

        this.newRule.auditMembersRealName = {}
        this.newRule.auditMembers.forEach(i => {
          this.newRule.auditMembersRealName[i.id] = i.realName
        })
        this.newRule.auditMembers = this.newRule.auditMembers.map(i => i.id)
      }
    },
    submitSolutionRule() {
      if (this.newRule.loading) return this.$message.info('加载中')
      this.newRule.loading = true
      var fn =
        this.newRule.mode === 'edit'
          ? editStreamSolutionRule
          : addStreamSolutionRule
      fn(
        this.newRule.id,
        this.newRule.name,
        this.newRule.description,
        this.newRule.solutionName,
        this.newRule.priority,
        this.newRule.enable,
        buildFilter(this.newRule),
        this.newRule.auth
      )
        .then(() => {
          this.$message.success(`方案规则 ${this.newRule.name}已提交`)
          this.refresh()
        })
        .finally(() => {
          this.newRule.loading = false
        })
    },
    buildNewSolutionRule() {
      var lastAuth = this.newRule ? this.newRule.auth : null
      if (lastAuth === null) {
        lastAuth = {
          authByUserId: '',
          code: 0
        }
      }
      return {
        mode: 'new',
        name: '',
        description: '',
        priority: 0,
        enable: false,
        solutionName: '',

        duties: [],
        dutyIsMajor: 0,
        dutyTags: [],
        companies: [],
        companiesName: {},
        companyRefer: '',
        companyTags: [],
        companyCodeLength: [],
        auditMembersCount: 1,
        auditMembers: [],
        auditMembersRealName: {},
        auth: lastAuth,
        loading: false
      }
    }
  }
}
</script>

<style>
</style>
