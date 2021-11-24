<template>
  <div class="app-container">
    <div v-if="!$route.meta.showDetail">
      <el-card shadow="never">
        <el-form :label-position="'left'" label-width="50px">
          <el-form-item label="组织" style="margin-bottom: 0px !important">
            <el-cascader
              v-model="organizations"
              :options="organizationsOptions"
              :props="organizationsProps"
              ref="cascader"
              style="width: 380px"
            >
            </el-cascader>
            <el-button
              type="primary"
              style="float: right"
              plain
              :disabled="arrangeDisabled"
              @click="arrangeConfirm"
              >安排谈话</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="never" style="margin: 10px 0">
        <div class="table-container">
          <div class="student-container">
            <el-row :gutter="20" style="display: flex; align-items: center">
              <el-col :span="23">
                <span class="title">选择学生</span>
                <span
                  class="value"
                  style="float: right; margin-top: 20px; font-size: 14px"
                  >当前已选 {{ student_selected_count }} 名</span
                >
                <el-form
                  :label-position="'left'"
                  label-width="80px"
                  style="margin-top: 20px"
                >
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="已安排">
                        <el-radio-group v-model="studentForm.has_planned">
                          <el-radio :label="true">是</el-radio>
                          <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="已完成">
                        <el-radio-group v-model="studentForm.has_finished">
                          <el-radio :label="true">是</el-radio>
                          <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                        <el-button
                          type="primary"
                          size="small"
                          style="margin-left: 20px"
                          @click="studentConfirm"
                          >确 定</el-button
                        >
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-table
                  border
                  element-loading-text="加载中"
                  v-loading="studentTableLoading"
                  :data="studentTable"
                  height="550"
                  highlight-current-row
                  class="table"
                  @selection-change="studentSelectionChange"
                >
                  >
                  <el-table-column
                    :selectable="studentSelectCheck"
                    type="selection"
                    width="50"
                  >
                  </el-table-column>
                  <el-table-column prop="name" label="姓名"> </el-table-column>
                  <el-table-column prop="student_id" label="学号">
                  </el-table-column>
                  <el-table-column prop="arranged" label="已安排" width="70">
                  </el-table-column>
                  <el-table-column prop="finished" label="已完成" width="70">
                  </el-table-column>
                  <el-table-column prop="speaker" label="谈话人">
                  </el-table-column>
                  <el-table-column
                    prop="speaker_id"
                    label="谈话人学工号"
                  ></el-table-column>
                  <el-table-column label="详情" width="80">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        v-if="scope.row.talk_record_list.length > 0"
                        @click="handleLook(scope.row)"
                        >查看</el-button
                      >
                      <span v-if="scope.row.talk_record_list <= 0">-</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="1">
                <i
                  v-if="fold == false"
                  class="el-icon-arrow-right"
                  style="cursor: pointer"
                  @click="foldRight"
                ></i>
                <i
                  v-if="fold == true"
                  class="el-icon-arrow-left"
                  style="cursor: pointer"
                  @click="unfoldRight"
                ></i
              ></el-col>
              <span
                v-show="!party_show"
                style="width: 14px; font-size: 14px; color: #909399"
                >选择党员</span
              >
            </el-row>
          </div>

          <el-dialog
            title="谈话列表"
            :visible.sync="talkDialog"
            width="50%"
            center
          >
            <el-table
              border
              element-loading-text="加载中"
              v-loading="talkTableLoading"
              :data="talkTable"
              highlight-current-row
              class="table"
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column prop="name" label="谈话人姓名">
              </el-table-column>
              <el-table-column prop="student_id" label="谈话人学工号">
              </el-table-column>
              <el-table-column prop="time" label="时间"> </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      lookInfo(scope.row.user_id, scope.row.record_form_id)
                    "
                    >查看</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    v-if="scope.row.status == 1"
                    @click="deleteTalk(scope.row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>

          <transition name="slide-fade">
            <div class="party-container" v-show="party_show">
              <span class="title">选择党员</span>
              <el-form :label-position="'left'" label-width="100px">
                <el-form-item label="所在部门" style="margin: 20px 0 0 0">
                  <el-radio-group v-model="party_organization">
                    <el-radio :label="1">本部</el-radio>
                    <el-radio :label="0">其他支部</el-radio>
                  </el-radio-group>
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 20px; display: inline-block"
                    @click="partyConfirm"
                    >确 定</el-button
                  >
                </el-form-item>
                <el-form-item>
                  <el-cascader
                    v-if="party_organization == 0"
                    v-model="party_organizations"
                    :options="organizationsOptions"
                    :props="partyOrgProps"
                    size="small"
                  >
                  </el-cascader>
                </el-form-item>
              </el-form>
              <el-table
                border
                element-loading-text="加载中"
                v-loading="partyTableLoading"
                :data="partyTable"
                height="520"
                highlight-current-row
                class="table"
                ref="partyTable"
                @select="select"
                @select-all="selectAll"
              >
                <el-table-column type="selection" width="50"> </el-table-column>
                <el-table-column prop="name" label="姓名"> </el-table-column>
                <el-table-column prop="student_id" label="学工号">
                </el-table-column>
              </el-table>
            </div>
          </transition>
        </div>
      </el-card>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { organizations } from "@/api/partyMembership";
import {
  getTalkers,
  getUsers,
  createTalk,
  deleteTalk,
} from "@/api/conversation";

export default {
  data() {
    return {
      organizations: [],
      party_organizations: [1],
      organizationsOptions: [],
      organizationsProps: {
        lazy: true,
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
      partyOrgProps: {
        lazy: true,
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
      studentForm: {
        step_index: 2,
        has_planned: null,
        has_finished: false,
      },
      studentTable: [],
      studentTableLoading: false,
      studentSelection: [],
      party_organization: 1,
      partyTable: [],
      fold: false,
      party_show: true,
      partyTableLoading: false,
      partySelection: [],
      talkDialog: false,
      talkTableLoading: false,
      talkTable: [],
    };
  },
  created() {
    this.getOrg();
  },
  computed: {
    arrangeDisabled: function () {
      if (this.partySelection.length <= 0 || this.studentSelection.length <= 0)
        return true;
      else return false;
    },
    student_selected_count: function () {
      return this.studentSelection.length;
    },
    party_selected_count: function () {
      return this.partySelection.length;
    },
  },
  mounted() {
    setInterval(function () {
      document.querySelectorAll(".el-cascader-node__label").forEach((el) => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
  },
  methods: {
    msgError(msg) {
      this.$message.error(msg);
    },
    msgSuccess(msg) {
      this.$message({
        message: msg,
        type: "success",
      });
    },
    foldRight() {
      this.fold = true;
      this.party_show = false;
    },
    unfoldRight() {
      this.fold = false;
      this.party_show = true;
    },
    getOrg() {
      if (this.$store.state.school_id) {
        this.organizations[0] = this.$store.state.school_id;
        this.party_organizations[0] = this.$store.state.school_id;
      }
      if (this.$store.state.college_id) {
        this.organizations[1] = this.$store.state.college_id;
        this.party_organizations[1] = this.$store.state.college_id;
      }
      if (this.$store.state.class_id) {
        this.organizations[2] = this.$store.state.class_id;
        this.party_organizations[2] = this.$store.state.class_id;
      }
    },
    studentConfirm() {
      this.studentTable = [];
      var _this = this;
      var data = this.getStudentForm();
      if (!data) return;
      this.studentTableLoading = true;
      getUsers(data)
        .then((res) => {
          if (res !== false) {
            _this.studentTable = _this.convertStudentTable(res.data);
            _this.studentTableLoading = false;
          }
        })
        .catch((err) => {
          this.msgError("获取学生列表失败！");
        });
    },
    getStudentForm() {
      var data = {};
      if (this.organizations.length == 0) {
        this.msgError("请选择组织信息！");
        return;
      }
      this.$store.state.school_id = this.organizations[0];
      this.$store.state.college_id = this.organizations[1];
      this.$store.state.class_id = this.organizations[2];
      data.self_o_id = this.organizations[this.organizations.length - 1];
      data.step_index = this.studentForm.step_index;
      if (this.studentForm.has_planned !== null) {
        data.has_planned = this.studentForm.has_planned;
      }
      data.has_finished = this.studentForm.has_finished;
      return data;
    },
    convertStudentTable(olist) {
      var list = [];
      olist.forEach((item) => {
        var i = {};
        i.user_id = item.user_id;
        i.name = item.user_name;
        i.student_id = item.user_student_id;
        i.arranged = item.has_planned == true ? "是" : "否";
        i.finished = item.has_finished == true ? "是" : "否";
        i.speaker =
          item.talk_record_list.length > 0
            ? item.talk_record_list[0].talker_name
            : "-";
        i.speaker_id =
          item.talk_record_list.length > 0
            ? item.talk_record_list[0].talker_student_id
            : "-";
        i.talk_record_list = item.talk_record_list;
        list.push(i);
      });
      return list;
    },
    studentSelectCheck(row) {
      return row.finished == "是" ? false : true;
    },
    studentSelectionChange(val) {
      this.studentSelection = val;
    },
    handleLook(data) {
      if (data.talk_record_list.length > 1) {
        this.talkDialog = true;
        this.talkTableLoading = true;
        this.talkTable = [];
        data.talk_record_list.forEach((item) => {
          var i = {};
          i.name = item.talker_name;
          i.student_id = item.talker_student_id;
          i.id = item.id;
          i.time = this.convertTime(item.create_at);
          //跳页需要的信息
          i.user_id = data.user_id;
          i.record_form_id = item.record_form_id;

          i.status = item.status;
          this.talkTable.push(i);
        });
        this.talkTableLoading = false;
      } else if (data.talk_record_list.length == 1) {
        this.lookInfo(data.user_id, data.talk_record_list[0].record_form_id);
      }
    },
    convertTime(timestamp) {
      var time = new Date(timestamp * 1000);
      return (
        time.toLocaleDateString().replace(/\//g, "-") +
        " " +
        time.toTimeString().substr(0, 5)
      );
    },
    lookInfo(user_id, form_id) {
      this.$router.push({
        path: "/info/conversations/details",
        query: { user_id: user_id, form_id: form_id },
      });
    },
    deleteTalk(talk_id) {
      deleteTalk(talk_id)
        .then((res) => {
          if (res !== false) {
            this.msgSuccess("删除对话成功！");
            this.talkDialog = false;
            this.studentConfirm();
          }
        })
        .catch((err) => {
          this.msgError("删除对话失败！");
        });
    },
    partyConfirm() {
      this.partyTable = [];
      var _this = this;
      var data = {};
      this.partyTableLoading = true;
      data.self_o_id = this.organizations[this.organizations.length - 1];
      if (this.party_organization == 0) {
        data.talker_o_id = this.party_organizations[
          this.party_organizations.length - 1
        ];
        if (data.self_o_id == data.talker_o_id) {
          this.partyTableLoading = false;
          this.msgError("请选择其他支部！");
          return;
        }
      }
      getTalkers(data)
        .then((res) => {
          if (res !== false) {
            _this.partyTableLoading = false;
            _this.partyTable = res.data;
          }
        })
        .catch((err) => {
          this.msgError("获取党员列表失败！");
        });
    },
    select(selection, row) {
      this.partySelection = [];
      this.$refs.partyTable.clearSelection();
      if (selection.length === 0) return;
      this.$refs.partyTable.toggleRowSelection(row, true);
      this.partySelection.push(row);
    },
    selectAll() {
      this.partySelection = [];
      this.$refs.partyTable.clearSelection();
    },
    arrangeConfirm() {
      var data = {};
      var _this = this;
      data.user_id_list = [];
      this.studentSelection.forEach((item) => {
        data.user_id_list.push(item.user_id);
      });
      data.talker_id = this.partySelection[0].id;
      data.type = 1;
      data.form_name = "talk-record-when-join-form";
      createTalk(data)
        .then((res) => {
          if (res !== false) {
            _this.msgSuccess("安排谈话成功！");
            _this.studentConfirm();
          }
        })
        .catch((err) => {
          this.msgError("安排谈话失败！");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .table-container {
    display: flex;
    flex-direction: row;

    .student-container {
      min-width: 62.5%;
      max-width: 98%;
      flex: auto;

      .table {
        margin: 10px 0;
      }
    }
    .party-container {
      flex: none;
      max-width: 37.5%;
      min-width: 2%;
      padding: 0 20px;

      .table {
        margin: 20px 0;
      }
    }
  }
}
</style>

<style>
.title {
  font-size: 25px;
  font-weight: bold;
  color: #303133;
  margin: 0;
  display: inline-block;
  border-bottom: 2px solid #3a62d7;
  padding-bottom: 5px;
}

.value {
  color: #c0c4cc;
  font-weight: 400;
}

body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>