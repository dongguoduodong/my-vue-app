<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form :label-position="'left'" label-width="80px" v-model="objectForm">
        <el-form-item label="组织">
          <el-cascader
            v-model="organizations"
            :props="organizationsProps"
            ref="cascader"
            style="width: 380px"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="公示状态">
          <el-radio-group v-model="objectForm.publicity_status">
            <el-radio :label="1">未提交</el-radio>
            <el-radio :label="2">待审批</el-radio>
            <el-radio :label="3">待修正</el-radio>
            <el-radio :label="4">公示中</el-radio>
            <el-radio :label="5">已完成</el-radio>
            <el-radio :label="6">被合并</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click="searchConfirm">搜 索</el-button>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 10px">
      <el-button v-if="!select" @click="newClick()">新建</el-button>
      <el-button type="primary" v-if="merge" @click="mergeClick()" plain
        >合并</el-button
      >
      <el-table
        element-loading-text="加载中"
        v-loading="tableLoading"
        v-if="publicityTableShow"
        size="small"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
        :data="notification_table"
        style="margin-top: 20px"
      >
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column prop="name" label="公示名称"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间"> </el-table-column>
        <el-table-column prop="start_time" label="开始时间"> </el-table-column>
        <el-table-column prop="end_time" label="结束时间"> </el-table-column>
        <el-table-column prop="organizations" label="归属组织">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="details(scope.row.id)"
              >查看</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status == 1 || scope.row.status == 3"
              @click="submit(scope.row.id)"
              >提交</el-button
            >
            <!-- <el-button
              type="text"
              size="small"
              v-if="scope.row.status == 1 || scope.row.status == 3"
              @click="modify(scope.row.id)"
              >修改</el-button
            > -->
            <el-button
              type="text"
              size="small"
              v-if="
                scope.row.status == 1 ||
                scope.row.status == 2 ||
                scope.row.status == 3 ||
                scope.row.status == 4
              "
              @click="deletee(scope.row.id)"
              >废弃</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status == 2 && scope.row.creator_id !== user_id"
              @click="notify(scope.row.id)"
              >公示</el-button
            ><el-button
              type="text"
              size="small"
              v-if="scope.row.status == 2 && scope.row.creator_id !== user_id"
              @click="reject(scope.row.id)"
              >驳回</el-button
            >
            <span v-if="scope.row.status == 5 || scope.row.status == 6">-</span>
          </template>
        </el-table-column>
        -->
      </el-table>

      <el-dialog
        :visible.sync="DetailsDialogVisible"
        :before-close="handleClose"
        width="70%"
        center
      >
        <div class="con">
          <div style="margin-right: auto; margin-left: 50px">
            <p v-if="!editStatus">公示名称: {{ publicName }}</p>
            <p>
              <el-input
                v-if="editStatus"
                v-model="publicTitle"
                @blur="editStatus = false"
                placeholder="请输入内容"
                style="width: 400px"
              >
                <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
              </el-input>
            </p>
          </div>

          <div class="tit">
            <h2 v-if="!editStatus">{{ publicTitle }}</h2>
            <h2>
              <el-input
                v-if="editStatus"
                v-model="publicTitle"
                @blur="editStatus = false"
                placeholder="请输入内容"
                style="width: 400px"
              >
                <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
              </el-input>
            </h2>
          </div>
          <div class="context">
            <p v-if="!editStatus">{{ publicHead }}</p>
            <div>
              <el-input
                v-if="editStatus"
                type="textarea"
                autosize
                v-model="publicHead"
                @blur="editStatus = false"
                placeholder="请输入内容"
                style="width: 845px"
              >
                <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
              </el-input>
            </div>
          </div>
          <div class="table">
            <el-table
              :data="tableData"
              element-loading-text="加载中"
              size="small"
              v-loading="checkPulicityLoading"
              highlight-current-row
              border
              class="table_content"
              stripe
              :cell-style="{ 'text-align': 'center' }"
              :header-cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column prop="number" label="编号" width="50">
              </el-table-column>
              <el-table-column prop="class_id" label="班级号" width="100">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-if="editStatus"
                    v-model="scope.row.class_id"
                    @blur="changeValue(scope.row)"
                  />
                  <span style="font-size: 12px" v-else>{{
                    scope.row.class_id
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="student_id" label="学号" width="100">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-if="editStatus"
                    v-model="scope.row.student_id"
                    @blur="changeValue(scope.row)"
                  />
                  <span style="font-size: 12px" v-else>{{
                    scope.row.student_id
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="120">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-if="editStatus"
                    v-model="scope.row.name"
                    @blur="changeValue(scope.row)"
                  />
                  <span style="font-size: 12px" v-else>{{
                    scope.row.name
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="sex" label="性别" width="50">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-if="editStatus"
                    v-model="scope.row.sex"
                    @blur="changeValue(scope.row)"
                  />
                  <span style="font-size: 12px" v-else>{{
                    scope.row.sex
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="hometown" label="家乡" width="180">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-if="editStatus"
                    v-model="scope.row.hometown"
                    @blur="changeValue(scope.row)"
                  />
                  <span style="font-size: 12px" v-else>{{
                    scope.row.hometown
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="birthday" label="生日" width="150">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-if="editStatus"
                    v-model="scope.row.birthday"
                    @blur="changeValue(scope.row)"
                  />
                  <span style="font-size: 12px" v-else>{{
                    scope.row.birthday
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="join_party_at" label="入党申请时间">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-if="editStatus"
                    v-model="scope.row.join_party_at"
                    @blur="changeValue(scope.row)"
                  />
                  <span style="font-size: 12px" v-else>{{
                    scope.row.join_party_at
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="context">
            <p v-if="!editStatus">
              {{ foot.endnote }}
            </p>
            <el-input
              v-if="editStatus"
              type="textarea"
              size="small"
              autosize
              v-model="foot.endnote"
              @blur="editStatus = false"
              placeholder="请输入内容"
              style="width: 845px"
            >
              <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
            </el-input>
          </div>
          <div class="con_bottom">
            <p v-if="!editStatus">{{ foot.signature }}</p>
            <el-input
              v-if="editStatus && foot.signature !== ''"
              v-model="foot.signature"
              size="small"
              @blur="editStatus = false"
              placeholder="请输入内容"
              style="width: 400px"
            >
              <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
            </el-input>

            <p v-if="!editStatus">{{ foot.time }}</p>
            <p>
              <el-input
                v-if="editStatus && foot.time !== ''"
                v-model="foot.time"
                size="small"
                @blur="editStatus = false"
                placeholder="请输入内容"
                style="width: 350px"
              >
                <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
              </el-input>
            </p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              plain
              type="success"
              v-if="detailsStatus == 1 || detailsStatus == 3"
              @click="submit(selectedId)"
              >提 交</el-button
            >
            <el-button
              plain
              type="primary"
              v-if="(detailsStatus == 1 || detailsStatus == 3) && !editStatus"
              @click="modify(selectedId)"
              >修 改</el-button
            >
            <el-button
              plain
              type="primary"
              v-if="(detailsStatus == 1 || detailsStatus == 3) && editStatus"
              @click="cancelMethod(selectedId)"
              >取 消</el-button
            >
            <el-button
              plain
              type="danger"
              v-if="
                detailsStatus == 1 ||
                detailsStatus == 2 ||
                detailsStatus == 3 ||
                detailsStatus == 4
              "
              @click="deletee(selectedId)"
              >废 弃</el-button
            >
            <el-button
              plain
              type="success"
              v-if="detailsStatus == 2"
              @click="notify(selectedId)"
              >公 示</el-button
            ><el-button
              plain
              type="danger"
              v-if="detailsStatus == 2"
              @click="reject(selectedId)"
              >驳 回</el-button
            >
          </span>
        </div>
      </el-dialog>
      <div class="paginationDiv">
        <el-pagination
          v-if="publicityTableShow"
          layout="prev, pager, next"
          :page-size="20"
          :current-page="currentPage"
          background
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>

      <el-dialog
        title="提交公示"
        :visible.sync="submitDialog"
        width="35%"
        center
      >
        <el-form
          :label-position="'left'"
          label-width="80px"
          v-loading="remindedUserLoading"
        >
          <el-form-item label="提醒人">
            <el-checkbox-group v-model="remindedUser">
              <el-checkbox
                v-for="item in remindedUseroptions"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="submitConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="makeNewTablePublicityNameVisible"
        width="30%"
      >
        <p>请输入公示标题</p>
        <el-input
          v-model="makeNewTable.publicity_name"
          :disabled="true"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="makeNewTablePublicityNameVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="makeNewTablePublicityNameConfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :title="dialog_title"
        :visible.sync="newDialog"
        width="50%"
        @close="closeDialog"
        center
      >
        <el-form :label-position="'left'" label-width="80px">
          <el-form-item label="组织">
            <el-cascader
              v-model="new_organizations"
              :props="organizationsProps"
              ref="new_cascader"
              style="width: 380px"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="公示类型">
            <el-select
              v-model="selectedUser.political_status"
              placeholder="请选择公示类型"
              style="width: 380px"
            >
              <el-option
                v-for="item in publicity_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="newDialogClick()"
              >搜 索</el-button
            >
            <el-button
              v-if="newTableShow"
              type="primary"
              style="float: right"
              @click="makeNewTableClick"
              plain
              >创 建</el-button
            >
          </el-form-item>

          <el-table
            v-if="newTableShow"
            element-loading-text="加载中"
            v-loading="newTableLoading"
            :data="new_notification_table"
            ref="newNotificationTable"
            highlight-current-row
            @selection-change="newHandleSelectionChange"
            border
          >
            <el-table-column type="selection" width="50"> </el-table-column>
            <el-table-column prop="name" label="姓名"> </el-table-column>
            <el-table-column prop="student_id" label="学号"> </el-table-column>
            <el-table-column prop="phone" label="联系方式"> </el-table-column>
            <el-table-column prop="sex" label="性别"> </el-table-column>
          </el-table>
          <div class="paginationDiv" v-show="newPaginationShow">
            <el-pagination
              layout="prev, pager, next"
              :page-size="20"
              :current-page="newCurrentPage"
              background
              @current-change="handleNewCurrentChange"
            >
            </el-pagination>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="mergeDialogVisible"
        width="30%"
        class="mergeDialogVisible"
      >
        <p>请输入合并后的新标题</p>
        <el-input
          v-model="mergeData.publicity_name"
          placeholder="请输入内容"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="mergeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="mergeConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="删除公示"
        :visible.sync="deleteDialog"
        class="deleteDialog"
        width="35%"
        center
      >
        <span style="display: table; margin: 0 auto; font-size: 16px"
          >确定删除该公示？</span
        >
        <span slot="footer">
          <el-button type="primary" @click="handleDelete()">确 定</el-button>
          <el-button type="danger" @click="deleteDialog = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        title="公示"
        :visible.sync="notifyDialog"
        class="notifyDialog"
        width="35%"
        center
      >
        <el-form :label-position="'left'" label-width="100px">
          <el-form-item label="公示时间" style="margin-bottom: 0px !important">
            <div class="block">
              <el-date-picker
                v-model="publicity_end_time"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="notifyConfirm">确 定</el-button>
          <el-button type="danger">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="驳回公示"
        :visible.sync="rejectDialog"
        class="rejectDialog"
        width="50%"
        center
      >
        <el-form :label-position="'left'" label-width="80px">
          <el-form-item label="驳回理由" style="margin-bottom: 0px !important">
            <el-input
              style
              type="textarea"
              :rows="3"
              placeholder="请输入修改意见"
              v-model="rejectReason"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="confirmReject">确 定</el-button>
          <el-button type="danger">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { organizations, searchUser } from "@/api/partyMembership";
import {
  searchPublicity,
  deletePublicity,
  checkPublicity,
  mergePublicity,
  rejectPublicity,
  makePublicity,
  searchPublicityApprover,
  submitPublicity,
  notifyPublicity,
  modifyPublicity,
  getOrganizationDetails
} from "@/api/publicity";
import { getInfo } from "@/api/user";

export default {
  data() {
    return {
      organizations: [1],
      new_organizations: [1],
      party_organizations: [1],
      organizationsProps: {
        lazy: true,
        // multiple: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          setTimeout(() => {
            if (level == 0) {
              organizations().then((res) => {
                const nodes = res.data.map((value, i) => ({
                  value: value.id,
                  label: value.name,
                  leaf: node.level >= 2,
                }));
                resolve(nodes);
              });
            } else {
              organizations({ parent_id: node.value }).then((res) => {
                const nodes = res.data.map((value, i) => ({
                  value: value.id,
                  label: value.name,
                  leaf: node.level >= 2,
                }));
                resolve(nodes);
              });
            }
          }, 100);
        },
      },
      select: false,
      merge: false,
      tableLoading: false,
      newTableLoading: false,
      notification_table: [],
      new_notification_table: [],
      submitDialog: false,
      newDialog: false,
      dialog_title: "",
      newTableShow: false,
      deleteDialog: false,
      notifyDialog: false,
      notifyTime: 1,
      rejectDialog: false,
      rejectReason: "",
      publicity_end_time: "",
      editStatus: "",
      editModeEnabled: false,
      remindedUseroptions: [],
      remindedUserLoading: false,
      user_id: null,
      user_id_lis: [],
      selected_user_id_lis: [],
      makeNewTablePublicityNameVisible: false,
      // newHandleSelectionChangeTemp: [],
      handleCurrentChangeSave: null,
      mergeData: {
        publicity_id_list: [],
        publicity_name: "",
      },

      mergeDialogVisible: false,
      organization_id: null,
      checkPulicityLoading: false,
      DetailsDialogVisible: false,
      publicName: "",
      publicTitle: "",
      publicHead: "",
      publicityStartTime: '',
      publicityEndTime: '',
      tableData: [],
      tablelabels: [],
      publicityTableShow: false,
      selectRemindedDialogVisible: false,
      detailsStatus: 4,
      selectedId: "",
      remindedUser: [],
      total: 0,
      currentPage: 1,
      newCurrentPage: 1,
      newPaginationShow: false,
      parent_organization: 0,
      objectForm: {
        o_id: null,
        publicity_status: "",
      },
      publicity_options: [
        {
          value: "3",
          label: "入党申请人",
        },
        {
          value: "4",
          label: "入党积极分子",
        },
        {
          value: "5",
          label: "发展对象",
        },
        {
          value: "6",
          label: "预备党员",
        },
        {
          value: "7",
          label: "党员",
        },
      ],
      selectedUser: {
        school_id: null,
        college_id: null,
        class_id: null,
        is_fuzzy: true,
        political_status: "",
      },
      selecteUser_political_status_label:"", 
      makeNewTable: {
        search_condition: {
          user_id_list: [],
        },
        publicity_name: "",
        creator_id: 0,
        publicity_type: 1,
        organization_id: null,
      },
      checkPulicity: {
        number: 1,
        class_id: null,
        student_id: null,
        name: "",
        sex: "",
        hometown: "",
        birthday: "",
        join_party_at: "",
      },
      foot: {
        endnote: "",
        signature: "",
        time: "",
      },
      modifyData: {
        publicity_name: "",
        content: {
          title: "",
          head: "",
          personnel_table: [],
          foot: {
            endnote: "",
            signature: "",
            time: "",
          },
        },
      },
    };
  },
  created() {
    this.getOrg();
  },
  mounted() {
    setInterval(function () {
      document.querySelectorAll(".el-cascader-node__label").forEach((el) => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
    getInfo().then((res) => {
      this.user_id = res.data.id;
    });
  },
  methods: {
    getOrg() {
      if (this.$store.state.school_id) {
        this.organizations[0] = this.$store.state.school_id;
        this.new_organizations[0] = this.$store.state.school_id;
      }
      if (this.$store.state.college_id) {
        this.organizations[1] = this.$store.state.college_id;
      }
      if (this.$store.state.class_id) {
        this.organizations[2] = this.$store.state.class_id;
      }
    },
    getOrganizationId() {
      var level = this.organizations.length;
      //set store
      this.$store.state.school_id = this.organizations[0];
      this.$store.state.college_id = this.organizations[1];
      this.$store.state.class_id = this.organizations[2];
      switch (level) {
        case 1:
          this.objectForm.o_id = this.organizations[0];
          break;
        case 2:
          this.objectForm.o_id = this.organizations[1];
          break;
        case 3:
          this.objectForm.o_id = this.organizations[2];
          break;
        default:
          this.msgError("获取检索对象信息失败！");
          break;
      }
    },
    getNewOrganizationId() {
      var level = this.new_organizations.length;
      //set store
      this.$store.state.school_id = this.new_organizations[0];
      this.$store.state.college_id = this.new_organizations[1];
      this.$store.state.class_id = this.new_organizations[2];
      switch (level) {
        case 1:
          this.selectedUser.school_id = this.new_organizations[0];
          this.selectedUser.college_id = null;
          this.selectedUser.class_id = null;
          this.makeNewTable.parent_organization = 0;
          this.parent_organization = this.new_organizations[0];
          this.makeNewTable.organization_id = this.new_organizations[0];
          break;
        case 2:
          this.selectedUser.school_id = this.new_organizations[0];
          this.selectedUser.college_id = this.new_organizations[1];
          this.selectedUser.class_id = null;
          this.makeNewTable.organization_id = this.new_organizations[1];
          this.makeNewTable.parent_organization = this.new_organizations[0];
          this.parent_organization = this.new_organizations[0];
          break;
        case 3:
          this.selectedUser.school_id = this.new_organizations[0];
          this.selectedUser.college_id = this.new_organizations[1];
          this.selectedUser.class_id = this.new_organizations[2];
          this.makeNewTable.organization_id = this.new_organizations[2];
          this.makeNewTable.parent_organization = this.new_organizations[1];
          this.parent_organization = this.new_organizations[1];
          break;
        default:
          this.msgError("获取检索对象信息失败！");
          break;
      }
    },
    handleCurrentChange(currentPage) {
      var _this = this;
      if (
        _this.organizations.length <= 0 ||
        _this.objectForm.publicity_status === ""
      ) {
        _this.msgError("请选择检索对象和公示状态后再进行检索");
      } else {
        this.currentPage = currentPage;
        var data = _this.getObjectFormdata();
        searchPublicity(data)
          .then((res) => {
            _this.publicityTableShow = true;
            _this.tableLoading = true;
            if (res !== false) {
              var list = _this.convertTable(res.data);
              _this.total = res.count;
              _this.notification_table = list;
              _this.tableLoading = false;
            }
            _this.tableLoading = false;
          })
          .catch((err) => {
            _this.msgError("检索失败！");
          });
      }
    },

    handleNewCurrentChange(newCurrentPage) {
      var _this = this;
      if (
        _this.new_organizations.length <= 0 ||
        _this.selectedUser.political_status === ""
      ) {
        _this.msgError("请选择检索对象和公示状态后再进行检索");
      } else {
        this.newCurrentPage = newCurrentPage;
        var data = _this.getSelectedUserData();
        _this.publicity_options.forEach((e)=>{
          if (e.value === _this.selectedUser.political_status){
            _this.selecteUser_political_status_label = e.label;
          }
        })
        
        if (_this.parent_organization === 0) {
            _this.parent_organization = "杭州电子科技大学"
        } else {
          getOrganizationDetails(_this.parent_organization)
          .then((res) => {
            _this.parent_organization = res.data.name;
            // console.log("2",_this.parent_organization)
          })
        }
        setTimeout(()=>{
          _this.makeNewTable.publicity_name = _this.parent_organization+_this.selecteUser_political_status_label+"公示"
        }, 500)
        searchUser(data)
          .then((res) => {
            _this.newTableShow = true;
            _this.newTableLoading = true;
            if (res !== false) {
              var list = _this.newConvertTable(res.data);
              _this.total = res.count;
              _this.new_notification_table = list;
              _this.$nextTick(() => {
                _this.new_notification_table.forEach((row) => {
                  _this.$refs.newNotificationTable.toggleRowSelection(
                    row,
                    true
                  );
                });
              });
            }
            _this.newTableLoading = false;
          })
          .catch((err) => {
            _this.msgError("很抱歉，检索失败，您的权限不足！");
          });
      }
    },
    getObjectFormdata() {
      this.getOrganizationId();
      var data = {};
      for (let item in this.objectForm) {
        if (this.objectForm[item] !== null && this.objectForm[item] !== "") {
          data[item] = this.objectForm[item];
        }
      }
      data.page_id = this.currentPage;
      data.page_size = 20;
      return data;
    },
    getSelectedUserData() {
      this.getNewOrganizationId();
      var data = {};
      for (let item in this.selectedUser) {
        if (
          this.selectedUser[item] !== null &&
          this.selectedUser[item] !== ""
        ) {
          data[item] = this.selectedUser[item];
        }
      }
      data.page_id = this.newCurrentPage;
      data.page_size = 50;
      return data;
    },
    msgSuccess(msg) {
      this.$message({
        message: msg,
        type: "success",
      });
    },
    msgError(msg) {
      this.$message.error(msg);
    },
    searchConfirm() {
      var _this = this;
      if (
        _this.organizations.length <= 0 ||
        _this.objectForm.publicity_status === ""
      ) {
        _this.msgError("请选择检索对象和公示状态后再进行检索");
      } else {
        this.merge = true;
        this.currentPage = 1;
        var data = _this.getObjectFormdata();
        searchPublicity(data)
          .then((res) => {
            _this.publicityTableShow = true;
            _this.tableLoading = true;
            if (res !== false) {
              var list = _this.convertTable(res.data);
              _this.total = res.count;
              _this.notification_table = list;
              _this.tableLoading = false;
            }
            _this.tableLoading = false;
          })
          .catch((err) => {
            _this.msgError("很抱歉，检索失败，您的权限不足！");
          });
      }
    },

    convertTable(data) {
      var _this = this;
      var list = [];
      console.log(data);
      data.forEach((element) => {
        var item = {};
        item.creator_id = element.creator_id;
        item.name = element.publicity_name;
        item.create_time =
          element.create_at !== null
            ? _this.timestampToTime(element.create_at)
            : "暂无数据";
        item.start_time =
          element.start_time !== null
            ? _this.timestampToTime(element.start_time)
            : "暂无数据";
        item.end_time =
          element.end_time !== null
            ? _this.timestampToTime(element.end_time)
            : "暂无数据";
        var parent_organization_id = element.parent_organization_id;
        var organization = "";

        organizations({ parent_id: parent_organization_id }).then((res) => {
          for (var key in res.data) {
            if (res.data[key].id === element.organization_id) {
              organization = res.data[key].name;
            }
          }
        });

        setTimeout(() => {
          item.organizations =
            element.organization_id !== null ? organization : "暂无数据";
        }, 300);

        item.status = element.status !== null ? element.status : "暂无数据";
        item.id = element.id;
        setTimeout(() => {
          list.push(item);
        }, 300);
      });
      return list;
    },
    newConvertTable(data) {
      var _this = this;
      var list = [];
      data.forEach((element) => {
        var item = {};
        item.name = element.name;
        item.student_id =
          element.student_id !== null ? element.student_id : "暂无数据";
        item.phone = element.phone !== null ? element.phone : "暂无数据";
        var sexSet = {
          1: "男",
          2: "女",
        };
        item.sex = element.sex !== null ? sexSet[element.sex] : "暂无数据";
        item.id = element.id !== null ? element.id : "暂无数据";
        list.push(item);
      });
      return list;
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var H = (date.getHours() < 10 ? "0"+date.getHours(): date.getHours())+":"
      var Min = (date.getMinutes() < 10 ? "0"+date.getMinutes(): date.getMinutes())+":"
      var S = date.getSeconds() < 10 ? "0"+date.getSeconds(): date.getSeconds()
      return Y + M + D + H + Min + S;
    },
    newClick() {
      this.dialog_title = "新建公示";
      this.newDialog = true;
      this.newTableShow = false;
    },
    newDialogClick() {
      var _this = this;
      if (
        _this.new_organizations.length <= 0 ||
        _this.selectedUser.political_status === ""
      ) {
        _this.msgError("请选择检索对象和公示状态后再进行检索");
      } else {
        _this.newCurrentPage = 1;
        var data = _this.getSelectedUserData();
        _this.publicity_options.forEach((e)=>{
          if (e.value === _this.selectedUser.political_status){
            _this.selecteUser_political_status_label = e.label;
          }
        })
        
        if (_this.parent_organization === 0) {
            _this.parent_organization = "杭州电子科技大学"
        } else {
          getOrganizationDetails(_this.parent_organization)
          .then((res) => {
            _this.parent_organization = res.data.name;
            // console.log("2",_this.parent_organization)
          })
        }
        setTimeout(()=>{
          _this.makeNewTable.publicity_name = _this.parent_organization+_this.selecteUser_political_status_label+"公示"
        }, 500)
        searchUser(data)
          .then((res) => {
            _this.newTableShow = true;
            _this.newTableLoading = true;
            _this.newPaginationShow = true;
            if (res !== false) {
              var list = _this.newConvertTable(res.data);
              _this.total = res.count;
              _this.new_notification_table = list;
              _this.$nextTick(() => {
                _this.new_notification_table.forEach((row) => {
                  _this.$refs.newNotificationTable.toggleRowSelection(
                    row,
                    true
                  );
                });
              });

              // _this.new_notification_table.forEach((row) => {
              //   // _this.$refs.newNotificationTable.toggleRowSelection(row,true)
              //   _this.user_id_lis.push(row.id)
              //   // console.log(row.id)
              // })
            }
            res.data.forEach((item) => {
              _this.user_id_lis.push(item.id)
            })
            _this.newTableLoading = false;
          })
          // _this.$refs.newNotificationTable.toggleAllSelection()
          .catch((err) => {
            // _this.msgError("很抱歉，检索失败，您的权限不足！")
            _this.msgError(err);
          });
      }
    },
    makeNewTablePublicityNameConfirm() {
      this.makeNewTablePublicityNameVisible = false;
      this.newDialog = false;
      var data = this.getMakeNewTable();
      // console.log('data', data)
      makePublicity(data).then((res) => {
        console.log(res);
      });
      this.user_id_lis = []
      this.selected_user_id_lis = []
      this.searchConfirm()
    },
    getMakeNewTable() {
      var _this = this;
      // _this.newHandleSelectionChangeTemp.forEach((e)=>{
      //   _this.selected_user_id_lis.push(e.id)
      // })
      // console.log("_this.user_id_lis", _this.user_id_lis)
      _this.makeNewTable.search_condition.user_id_list = _this.selected_user_id_lis
      _this.makeNewTablecreator_id = _this.$store.state.user_id

      var set = {
        3: "1",
        4: "2",
        5: "3",
        6: "4",
        7: "6",
      };
      _this.makeNewTable.publicity_type =
        set[_this.selectedUser.political_status];
      var data = {};
      for (let item in _this.makeNewTable) {
        if (
          _this.makeNewTable[item] !== null &&
          _this.makeNewTable[item] !== ""
        ) {
          data[item] = _this.makeNewTable[item];
        }
      }
      data.creator_id = this.user_id;
      return data;
    },
    makeNewTableClick() {
      this.makeNewTablePublicityNameVisible = true;
    },
    closeDialog() {
      this.newCurrentPage = 1;
      this.newTableShow = false;
      this.newPaginationShow = false;
      this.selectedUser.political_status = "";
    },
    mergeClick() {
      this.mergeDialogVisible = true;
    },
    mergeConfirm() {
      this.mergeDialogVisible = false;
      var _this = this;
      var data = {};

      data["publicity_name"] = this.mergeData.publicity_name;
      data["publicity_id_list"] = this.mergeData.publicity_id_list;
      console.log(data);
      mergePublicity(data).then((res) => {
        console.log(res);
      });
    },
    details(id) {
      this.DetailsDialogVisible = true;
      this.checkPulicityLoading = true;
      this.selectedId = id;
      console.log(id);
      var _this = this;
      checkPublicity(id)
        .then((res) => {
          if (res != false) {
            console.log("res", res);
            _this.publicName = res.data.publicity_name;
            _this.publicTitle = res.data.content.title;
            _this.publicHead = res.data.content.head;
            _this.publicityStartTime = _this.timestampToTime(res.data.start_time);
            _this.publicityEndTime = _this.timestampToTime(res.data.end_time);
            _this.tableData = _this.getCheckPublicity(
              res.data.content.personnel_table
            );
            // var organization_ = {

            //   10: '本科生第三支部'
            // }
            // _this.organization_id = organization_[res.data.organization_id]
            _this.detailsStatus = res.data.status;
            _this.foot.endnote = res.data.content.foot.endnote
              ? res.data.content.foot.endnote
              : "";
            _this.foot.signature = res.data.content.foot.signature
              ? res.data.content.foot.signature
              : "";
            _this.foot.time = res.data.content.foot.time
              ? res.data.content.foot.time
              : "";
          }
          _this.checkPulicityLoading = false;
        })
        .catch((err) => {
          _this.$message.error(err);
        });
    },
    getCheckPublicity(data) {
      var _this = this
      var list = [];
      data.forEach((element) => {
        var item = {};
        element.forEach((e) => {
          switch (e.key) {
            case "number":
              item.number = e.default ? e.default : "暂无数据";
              break;
            case "class_id":
              item.class_id = e.default ? e.default : "暂无数据";
              break;
            case "student_id":
              item.student_id = e.default ? e.default : "暂无数据";
              break;
            case "name":
              item.name = e.default ? e.default : "暂无数据";
              break;
            case "sex":
              item.sex = e.default === 1 ? "男" : "女";
              break;
            case "hometown":
              item.hometown = e.default ? e.default : "暂无数据";
              break;
            case "birthday":
              item.birthday = e.default ? e.default : "暂无数据";
              break;
            case "join_party_at":
              item.join_party_at = _this.publicityStartTime && _this.publicityEndTime ?  _this.publicityStartTime + "——" + _this.publicityEndTime  : "暂无数据";
              break;
          }
        });
        list.push(item);
      });
      // console.log(list)
      return list;
    },
    submit(id) {
      this.submitDialog = true;
      this.selectedId = id;
      this.remindedUserLoading = true;
      // remindedUseroptions
      console.log(id);
      searchPublicityApprover("/v1/api/manage-publicity/signatory/" + id).then(
        (res) => {
          if (res !== false) {
            this.remindedUseroptions = [];
            res.data.forEach((item) => {
              this.remindedUseroptions.push({
                value: item.id,
                label: item.name,
              });
            });
          }
        }
      );
      this.remindedUserLoading = false;
    },
    submitConfirm() {
      this.submitDialog = false;
      let postData = { remindUserID: this.remindedUser };
      submitPublicity(this.selectedId, postData).then((res) => {
        console.log(res);
      });
    },
    modify(id) {
      this.dialog_title = "修改公示";
      this.selectedId = id;
      this.editStatus = true;
    },
    deletee(id) {
      this.deleteDialog = true;
      this.selectedId = id;
    },
    handleDelete() {
      deletePublicity({ id: this.selectedId });
      this.deleteDialog = false;
      this.searchConfirm();
    },
    notify(id) {
      this.notifyDialog = true;
      this.selectedId = id;
      this.notifyTime = 1;
      console.log(id);
    },
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    notifyConfirm() {
      console.log("this.publicity_end_time", this.publicity_end_time);
      var timestamp = Date.parse(this.publicity_end_time) / 1000;
      notifyPublicity(this.selectedId, { end_time: timestamp }).then((res) => {
        console.log(res);
        this.notifyDialog = false;
        this.msgSuccess("公示成功！");
      });
    },

    reject(id) {
      this.rejectDialog = true;
      this.selectedId = id;
      this.rejectReason = "";
      console.log(id);
    },
    confirmReject() {
      var data = { reason: this.rejectReason.toString() };
      console.log("confirm_start");
      console.log(this.selectedId);
      rejectPublicity(this.selectedId, data);
      console.log("confirm_end");
    },
    discard(id) {
      this.selectedId = id;
    },
    handleSelectionChange(val) {
      this.handleCurrentChangeSave = val;
      var lis = [];
      this.handleCurrentChangeSave.forEach((e) => {
        lis.push(e.id);
      });
      this.mergeData.publicity_id_list = lis;
      // console.log(val)
    },
    newHandleSelectionChange(val) {
      this.selected_user_id_lis = [];
      var _this = this;
      val.forEach((item) => {
        _this.selected_user_id_lis.push(item.id);
      });
      // console.log(_this.selected_user_id_lis);
      // this.newHandleSelectionChangeTemp = val
    },
    changeValue(data) {
      this.editStatus = false;
      var _this = this;
      console.log(data);
      var modifyset = {};
      modifyset["number"] = data.number;
      modifyset["student_id"] = data.student_id;
      modifyset["name"] = data.name;
      modifyset["class_id"] = data.class_id;
      modifyset["hometown"] = data.hometown;
      modifyset["join_party_at"] = data.join_party_at;
      var set = {
        男: 1,
        女: 2,
      };
      modifyset["sex"] = set[data.sex];
      modifyset["birthday"] = data.birthday;
      for (var item in modifyset) {
        // _this.tableData[parseInt(modifyset["number"])].student_id = modifyset["student_id"]
        _this.tableData[parseInt(modifyset["number"]) - 1].name =
          modifyset["name"];
        _this.tableData[parseInt(modifyset["number"]) - 1].class_id =
          modifyset["class_id"];
        _this.tableData[parseInt(modifyset["number"]) - 1].sex =
          modifyset["sex"];
        _this.tableData[parseInt(modifyset["number"]) - 1].hometown =
          modifyset["hometown"];
        _this.tableData[parseInt(modifyset["number"]) - 1].join_party_at =
          modifyset["join_party_at"];
        _this.tableData[parseInt(modifyset["number"]) - 1].birthday =
          modifyset["birthday"];
      }
      _this.modifyData.publicity_name = _this.publicName;
      var lis = [];
      _this.tableData.forEach((element) => {
        console.log("element", element);
        var temp = [];
        for (var e in element) {
          var set = {};
          set["key"] = e;
          set["default"] = element[e];
          temp.push(set);
        }
        lis.push(temp);
      });
      // console.log(lis)

      _this.modifyData.content.personnel_table = lis;
      _this.modifyData.content.title = _this.publicTitle;
      _this.modifyData.content.head = _this.publicHead;
      _this.modifyData.content.foot.endnote = _this.foot.endnote;
      _this.modifyData.content.foot.signature = _this.foot.signature;
      _this.modifyData.content.foot.time = _this.foot.time;
      // console.log(_this.modifyData)
      modifyPublicity(_this.selectedId, _this.modifyData).then((res) => {
        console.log(res);
      });
      checkPublicity(_this.selectedId)
        .then((res) => {
          if (res != false) {
            console.log("res", res);
            _this.publicName = res.data.publicity_name;
            _this.publicTitle = res.data.content.title;
            _this.publicHead = res.data.content.head;
            _this.publicityStartTime = _this.timestampToTime(res.data.start_time);
            _this.publicityEndTime = _this.timestampToTime(res.data.end_time);
            _this.tableData = _this.getCheckPublicity(
              res.data.content.personnel_table
            );
            // var organization_ = {

            //   10: '本科生第三支部'
            // }
            // _this.organization_id = organization_[res.data.organization_id]
            _this.detailsStatus = res.data.status;
            _this.foot.endnote = res.data.content.foot.endnote
              ? res.data.content.foot.endnote
              : "";
            _this.foot.signature = res.data.content.foot.signature
              ? res.data.content.foot.signature
              : "";
            _this.foot.time = res.data.content.foot.time
              ? res.data.content.foot.time
              : "";
          }
          _this.checkPulicityLoading = false;
        })
        .catch((err) => {
          _this.$message.error(err);
        });
    },
    cancelMethod(id) {
      this.editStatus = false;
    },
    handleClose(done) {
      this.editStatus = false;
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.con {
  // width: 90%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  .tit {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: 5px 0;
    color: #303133;
  }
  .context {
    width: 90%;
    color: #606266;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    p {
      text-indent: 2em;
      line-height: 30px;
    }
  }
  .table {
    width: 90%;
    margin-top: 20px;
    border-bottom: none;
    margin-bottom: 20px;
    .table_content {
      white-space: nowrap;
    }
  }
  .con_bottom {
    margin-left: auto;
    margin-right: 50px;
    margin-top: 10px;
  }
}
.dialog-footer {
  button {
    margin: 20px 20px;
    width: 100px;
  }
}

.deleteDialog {
  button {
    margin: 20px 20px;
    width: 100px;
  }
}
.notifyDialog {
  button {
    margin: 20px 20px;
    width: 100px;
  }
}
.rejectDialog {
  button {
    margin: 20px 20px;
    width: 100px;
  }
}
</style>
