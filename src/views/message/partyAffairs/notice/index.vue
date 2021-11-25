<template>
  <div class="app-container">
    <el-card shadow="never" v-if="!$route.meta.showDetail">
      <el-tabs class="card" v-model="activeName">
        <!-- 新增通知 -->
        <el-tab-pane label="新增通知" name="create">
          <el-row>
            <!-- left -->
            <el-col :span="15" class="left-box">
              <span class="title">创建通知</span>
              <el-form
                :label-position="'left'"
                v-model="noticeForm"
                class="form"
                label-width="100px"
              >
                <el-form-item label="通知名称">
                  <el-input
                    v-model="noticeForm.name"
                    placeholder="请输入通知标题"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item label="起止时间">
                <el-date-picker
                  v-model="noticeForm.time"
                  type="datetimerange"
                  range-separator="至"
                  value-format="timestamp"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="提醒时间">
                <el-date-picker
                  v-model="noticeForm.notice_time"
                  type="datetime"
                  value-format="timestamp"
                  placeholder="选择提醒时间"
                >
                </el-date-picker>
              </el-form-item> -->
                <el-form-item label="主要内容">
                  <el-input
                    type="textarea"
                    :rows="16"
                    placeholder="请输入主要内容"
                    v-model="noticeForm.text"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="添加附件">
                  <el-upload
                    action="http://101.34.237.153:7000/v1/api/files"
                    multiple
                    :on-remove="fileupload_remove"
                    :on-success="fileupload_success"
                    :on-error="fileupload_error"
                    :limit="1"
                    :file-list="noticeForm.fileList"
                    name="files"
                  >
                    <el-button size="small">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>

              <el-button
                type="primary"
                style="float: right;"
                @click="confirmCreate"
                >确 定</el-button
              >
            </el-col>

            <!-- right -->
            <el-col :span="9" class="right-box">
              <span class="title">通知对象</span>
              <el-form
                v-model="objectForm"
                class="form"
                :label-position="'left'"
                label-width="100px"
                v-if="objectFormVisible"
              >
                <el-form-item label="检索范围">
                  <el-cascader
                    v-model="organizations"
                    :options="organizationsOptions"
                    :props="organizationsProps"
                    style="width: 380px"
                  >
                  </el-cascader>
                </el-form-item>
                <el-form-item>
                  <el-switch
                    v-model="objectForm.is_fuzzy"
                    active-text="模糊搜索"
                    inactive-text="精确搜索"
                  >
                  </el-switch>
                  <p v-if="!objectForm.is_fuzzy">精确搜索至少填写一项</p>
                  <p v-if="objectForm.is_fuzzy">模糊搜索每项可选</p>
                </el-form-item>
                <el-form-item
                  label="模糊搜索"
                  v-if="objectForm.is_fuzzy === true"
                >
                  <div>
                    <div class="detail">
                      <div class="searchTitle">
                        <p>性别：</p>
                      </div>
                      <div class="content">
                        <el-radio v-model="objectForm.sex" :label="1"
                          >男</el-radio
                        >
                        <el-radio v-model="objectForm.sex" :label="2"
                          >女</el-radio
                        >
                      </div>
                    </div>
                    <div class="detail">
                      <div class="searchTitle">
                        <p>职务：</p>
                      </div>
                      <div class="content">
                        <el-checkbox-group
                          v-model="objectForm.position_id_list"
                        >
                          <el-checkbox
                            v-for="item in this.position_id_list"
                            :key="item.id"
                            :label="item.id"
                            >{{ item.name }}</el-checkbox
                          >
                        </el-checkbox-group>
                      </div>
                    </div>
                    <div
                      class="detail"
                      v-if="objectForm.step_index.length === 0"
                    >
                      <div class="searchTitle">
                        <p>政治情况：</p>
                      </div>
                      <div class="content">
                        <el-checkbox-group
                          v-model="objectForm.political_status"
                        >
                          <el-checkbox :label="1">群众</el-checkbox>
                          <el-checkbox :label="2">共青团员</el-checkbox>
                          <el-checkbox :label="3">入党申请人</el-checkbox>
                          <el-checkbox :label="4">入党积极分子</el-checkbox>
                          <el-checkbox :label="5">发展对象</el-checkbox>
                          <el-checkbox :label="6">预备党员</el-checkbox>
                          <el-checkbox :label="7">党员</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                    <div
                      class="detail"
                      v-if="objectForm.political_status.length === 0"
                    >
                      <div class="searchTitle">
                        <p>入党阶段：</p>
                      </div>
                      <div class="content">
                        <el-cascader
                          v-model="objectForm.step_index"
                          :options="options"
                          clearable
                          :show-all-levels="false"
                          :props="{ multiple: true }"
                        ></el-cascader>
                      </div>
                    </div>
                    <div class="detail">
                      <div class="searchTitle">
                        <p>学历：</p>
                      </div>
                      <div class="content">
                        <el-checkbox-group
                          v-model="objectForm.education_status"
                        >
                          <el-checkbox :label="1">本科在读</el-checkbox>
                          <el-checkbox :label="2">本科</el-checkbox>
                          <el-checkbox :label="3">硕士在读</el-checkbox>
                          <el-checkbox :label="4">硕士</el-checkbox>
                          <el-checkbox :label="5">博士在读</el-checkbox>
                          <el-checkbox :label="6">博士</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                    <div class="detail">
                      <div class="searchTitle">
                        <p>职称：</p>
                      </div>
                      <div class="content">
                        <el-checkbox-group v-model="objectForm.title_status">
                          <el-checkbox :label="1">学生</el-checkbox>
                          <el-checkbox :label="2">讲师</el-checkbox>
                          <el-checkbox :label="3">副教授</el-checkbox>
                          <el-checkbox :label="4">教授</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item
                  label="精确搜索"
                  v-if="objectForm.is_fuzzy === false"
                >
                  <div>
                    <div class="detail">
                      <p style="width: 80px">姓名：</p>
                      <el-input
                        style="width: 200px"
                        size="small"
                        placeholder="请输入姓名"
                        v-model="objectForm.keyword_name"
                      ></el-input>
                    </div>
                    <div class="detail">
                      <p style="width: 80px">学/工号：</p>
                      <el-input
                        style="width: 200px"
                        size="small"
                        placeholder="请输入学/工号"
                        v-model="objectForm.keyword_student_id"
                      ></el-input>
                    </div>
                    <div class="detail">
                      <p style="width: 80px">电话号：</p>
                      <el-input
                        style="width: 200px"
                        size="small"
                        placeholder="请输入电话号"
                        v-model="objectForm.phone"
                      ></el-input>
                    </div>
                    <div class="detail">
                      <p style="width: 80px">身份证号：</p>
                      <el-input
                        style="width: 200px"
                        size="small"
                        placeholder="请输入身份证号"
                        v-model="objectForm.IDCard"
                      ></el-input>
                    </div>
                  </div>
                </el-form-item>
                <el-button @click="searchObject">检 索</el-button>
              </el-form>
            </el-col>
          </el-row>

          <!-- dialog -->
          <el-dialog
            title="检索结果"
            :visible.sync="objdialogVisible"
            width="50%"
            center
          >
            <el-row style="margin-bottom: 10px">
              <el-col :span="12">
                <el-form class="tip" v-model="objTableSelected">
                  <span
                    >当前已选 {{ objTableSelected.selected_now }} 人（累计选取
                    {{
                      totalCount -
                      objTable.length -
                      excludeLength +
                      objectList_nosure.length
                    }}
                    人）。</span
                  >
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-button-group style="float: right">
                  <el-button
                    icon="el-icon-arrow-left"
                    size="mini"
                    :disabled="prevDisabled"
                    @click="Click(0)"
                  ></el-button>
                  <el-button
                    icon="el-icon-arrow-right"
                    size="mini"
                    :disabled="nextDisabled"
                    @click="Click(1)"
                  ></el-button>
                </el-button-group>
              </el-col>
            </el-row>
            <el-table
              border
              element-loading-text="加载中"
              v-loading="tableLoading"
              ref="objTableData"
              :data="objTable"
              @selection-change="handleSelectionChange"
              class="table"
              highlight-current-row
            >
              <el-table-column type="selection" width="50"> </el-table-column>
              <el-table-column prop="student_id" label="学号/工号" width="100">
              </el-table-column>
              <el-table-column prop="name" label="姓名"> </el-table-column>
              <el-table-column prop="sex" label="性别"> </el-table-column>
              <el-table-column prop="user_identity" label="身份">
              </el-table-column>
              <el-table-column
                prop="political_status"
                label="政治面貌"
              ></el-table-column>
              <el-table-column
                prop="education_status"
                label="学历"
              ></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmObjects"
                >确 定</el-button
              >
              <el-button @click="objdialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>

        <!-- 检索反馈 -->
        <el-tab-pane label="检索反馈" name="search">
          <div class="search-box">
            <span class="title">检索反馈</span>
            <el-form
              :label-position="'left'"
              label-width="100px"
              v-model="searchForm"
              class="form"
            >
              <el-row>
                <el-col :span="12" style="padding-right: 70px">
                  <el-form-item label="通知标题">
                    <el-input
                      placeholder="请输入通知标题"
                      v-model="searchForm.name"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-button type="primary" @click="searchFeedback"
                >检 索</el-button
              >
            </el-form>
          </div>
          <div
            class="table-box"
            v-show="noticeTableVisible"
            element-loading-text="加载中"
            v-loading="noticeTableLoading"
          >
            <el-divider content-position="center">检索结果</el-divider>
            <el-table border :data="noticeTable" class="table">
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column prop="name" label="通知标题"> </el-table-column>
              <el-table-column prop="type" label="所属类型"> </el-table-column>
              <el-table-column prop="read" label="确认人数"> </el-table-column>
              <el-table-column prop="signup" label="报名人数">
              </el-table-column>
              <el-table-column prop="leave" label="请假人数"> </el-table-column>
              <el-table-column prop="send" label="通知人数"> </el-table-column>
              <el-table-column label="详情" width="80">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="lookNoticeInfo(scope.row.origin)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="paginationDiv">
              <el-pagination
                layout="prev, pager, next"
                :page-size="20"
                :current-page="currentPage1"
                background
                :total="total1"
                @current-change="handleCurrentChange1"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <router-view></router-view>
  </div>
</template>

<script>
import { organizations } from "@/api/notice";
import { searchUser } from "@/api/notice";
import { searchUser_p } from "@/api/notice";
import { createNotice } from "@/api/notice";
import { searchFeedback } from "@/api/notice";
import { getPositionID } from "@/api/partyMembership";

export default {
  data() {
    return {
      options: [
        {
          value: 1,
          label: "入党申请阶段",
          children: [
            {
              value: 1,
              label: "递交入党申请书",
            },
            {
              value: 2,
              label: "党组织派人谈话",
            },
            {
              value: 3,
              label: "上报备案和公示",
            },
          ],
        },
        {
          value: 2,
          label: "积极分子阶段",
          children: [
            {
              value: 4,
              label: "推荐和确认入党积极分子",
            },
            {
              value: 5,
              label: "上报备案和公示",
            },
            {
              value: 6,
              label: "指定培养联系人",
            },
            {
              value: 7,
              label: "培养、教育和考察",
            },
          ],
        },
        {
          value: 3,
          label: "发展对象阶段",
          children: [
            {
              value: 8,
              label: "推荐和确认发展对象",
            },
            {
              value: 9,
              label: "上报备案和公示",
            },
            {
              value: 10,
              label: "确定入党介绍人",
            },
            {
              value: 11,
              label: "进行政治审查",
            },
            {
              value: 12,
              label: "开展短期集中培训",
            },
          ],
        },
        {
          value: 4,
          label: "预备党员接收阶段",
          children: [
            {
              value: 13,
              label: "支部委员审查",
            },
            {
              value: 14,
              label: "上报学院党委预审",
            },
            {
              value: 15,
              label: "填写入党志愿书",
            },
            {
              value: 16,
              label: "支部大会讨论",
            },
            {
              value: 17,
              label: "学院党委派人谈话",
            },
            {
              value: 18,
              label: "学院党委审批和报备",
            },
          ],
        },
        {
          value: 5,
          label: "预备党员转正阶段",
          children: [
            {
              value: 19,
              label: "入党宣誓",
            },
            {
              value: 20,
              label: "培养、教育和考察",
            },
            {
              value: 21,
              label: "递交转正申请",
            },
            {
              value: 22,
              label: "群众座谈和上报公示",
            },
            {
              value: 23,
              label: "支部审查",
            },
            {
              value: 24,
              label: "上报学院党委预审",
            },
            {
              value: 25,
              label: "支部大会讨论",
            },
            {
              value: 26,
              label: "学院党委审批和报备",
            },
            {
              value: 27,
              label: "材料归档",
            },
          ],
        },
      ],
      position_id_list: [],
      currentIndex: 0,
      pageFirstComeArray: [],
      exclude_user_id_list: [],
      excludeLength: 0,
      currentPage1: 1,
      total1: 0,
      activeName: "create",
      noticeForm: {
        name: "",
        // time: [],
        // notice_time: "",
        text: "",
        fileList: [],
      },
      // start_time: "",
      // end_time: "",
      // notice_time: "",
      organizations: [1],
      organizationsOptions: [],
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
      objType: [],
      objects: ["支部书记", "正式党员", "预备党员"],
      objectForm: {
        school_id: null,
        college_id: null,
        class_id: null,
        is_fuzzy: true,
        step_index: [],
        position_id_list: [],
        sex: null,
        keyword_name: null,
        keyword_student_id: null,
        phone: null,
        IDCard: null,
        political_status: [],
        education_status: [],
        title_status: [],
      },
      totalCount: 0, //选中总名单
      objectList_nosure: [], //当前页面选中名单
      objectList_nosure_key: [], //当前页面选中名单字典
      objectFormVisible: true,
      name: "",
      student_id: "",
      sex: null,
      objdialogVisible: false,
      objTable: [],
      tableLoading: false,
      objTableSelected: {
        selected_now: 0,
        selected_all: 0,
        selected_nosure: 0,
      },
      prevDisabled: false,
      nextDisabled: false,
      prev: null,
      next: null,
      searchForm: {
        name: "",
      },
      noticeTableVisible: false,
      noticeTableLoading: false,
      noticeTable: [],
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
    getPositionID({ page_id: 1, page_size: 50 })
      .then((res) => {
        if (res.data.length > 0) {
          this.position_id_list = res.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    getOrg() {
      if (this.$store.state.school_id) {
        this.organizations[0] = this.$store.state.school_id;
      }
      if (this.$store.state.college_id) {
        this.organizations[1] = this.$store.state.college_id;
      }
      if (this.$store.state.class_id) {
        this.organizations[2] = this.$store.state.class_id;
      }
    },
    handleCurrentChange1(currentPage) {
      this.currentPage1 = currentPage;
      var _this = this;
      var data = {};
      data.page_size = 20;
      data.page_id = this.currentPage1;
      if (this.searchForm.name) {
        data.keyword = this.searchForm.name;
      }

      this.noticeTableVisible = true;
      this.noticeTableLoading = true;
      searchFeedback(data)
        .then((res) => {
          if (res !== false && res.code == 200) {
            if (res.data.length > 0) {
              var list = _this.convertNoticeTable(res.data);
              _this.total1 = res.count;
              _this.noticeTable = list;
            } else {
              _this.msgError("未检索到结果！");
            }
            _this.noticeTableLoading = false;
          }
        })
        .catch((err) => {
          _this.msgError("检索失败！");
        });
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
    fileupload_success(response, file, fileList) {
      this.noticeForm.fileList.push({
        name: file.name,
        url: `${response[0].file_address}`,
      });
    },
    fileupload_error(err, file, fileList) {
      this.msgError("上传文件失败！");
    },
    fileupload_remove(file, fileList) {
      let url = `${file.url}`;
      for (let i = 0; i < this.noticeForm.fileList.length; i++) {
        if (this.noticeForm.fileList[i].url == url) {
          this.noticeForm.fileList.splice(i, 1);
        }
      }
      this.msgSuccess("移除文件成功！");
    },
    confirmCreate() {
      var data = {};
      const { name, text, fileList } = this.noticeForm;
      data.title = name;
      data.content = text;
      if (fileList.length > 0) {
        data.file_address = fileList[0].url;
      }
      data.user_search_condition = {};
      data.user_search_condition.school_id = this.objectForm.school_id;
      data.user_search_condition.college_id = this.objectForm.college_id;
      data.user_search_condition.class_id = this.objectForm.class_id;
      data.user_search_condition.keyword_name = this.objectForm.keyword_name;
      data.user_search_condition.keyword_student_id = this.objectForm.keyword_student_id;
      data.user_search_condition.sex = this.objectForm.sex;
      data.user_search_condition.political_status = this.objectForm.political_status;
      data.user_search_condition.user_id_list = [];
      data.user_search_condition.exclude_user_id_list = [];
      this.exclude_user_id_list.forEach((item) => {
        if (this.exclude_user_id_list[item] !== undefined) {
          data.user_search_condition.exclude_user_id_list.push(
            this.exclude_user_id_list[item]
          );
        }
      });

      createNotice(data)
        .then((res) => {
          if (res !== false && res.code == 200) {
            this.msgSuccess("创建成功！");
          }
        })
        .catch((err) => {
          this.msgError("创建失败!");
        });
    },
    searchObject() {
      this.exclude_user_id_list = [];
      this.currentPage = 1;
      var _this = this;
      if (_this.organizations.length <= 0) {
        _this.msgError("请选择通知党支部后再进行检索！");
      } else {
        var data = _this.getObjectFormdata();
        _this.objdialogVisible = true;
        _this.objTableLoading = true;
        searchUser(data)
          .then((res) => {
            if (res !== false) {
              _this.totalCount = res.count;
              let totalPage = Math.ceil(res.count / 20);
              for (let i = 0; i < totalPage; i++) {
                _this.pageFirstComeArray[i] = true;
              }
              _this.pageFirstComeArray[0] = false;
              var list = _this.convertObjtable(res.data);
              _this.loadObjdialog(list, res.previous, res.next);
            }
            _this.objTableLoading = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getOrganizationId() {
      var level = this.organizations.length;
      switch (level) {
        case 1:
          this.objectForm.school_id = this.organizations[0];
          this.objectForm.college_id = null;
          this.objectForm.class_id = null;
          break;
        case 2:
          this.objectForm.school_id = this.organizations[0];
          this.objectForm.college_id = this.organizations[1];
          this.objectForm.class_id = null;
          break;
        case 3:
          this.objectForm.school_id = this.organizations[0];
          this.objectForm.college_id = this.organizations[1];
          this.objectForm.class_id = this.organizations[2];
          break;
        default:
          this.msgError("获取检索对象信息失败！");
          break;
      }
    },
    getObjectSearchType() {
      var type = this.objType;
      this.objectForm.name = type.includes("姓名") ? this.name : "";
      this.objectForm.student_id = type.includes("学号")
        ? parseInt(this.student_id)
        : "";
      if (type.includes("身份")) {
        this.userIdentity[3] = this.userIdentityArray.includes("入党人")
          ? "1"
          : "0";
        this.userIdentity[2] = this.userIdentityArray.includes("预备党员")
          ? "1"
          : "0";
        this.userIdentity[1] = this.userIdentityArray.includes("党员")
          ? "1"
          : "0";
        this.userIdentity[0] = this.userIdentityArray.includes("支部书记")
          ? "1"
          : "0";
        this.user_identity =
          (this.userIdentity[0] +
            this.userIdentity[1] +
            this.userIdentity[2] +
            this.userIdentity[3]) *
          1;
        this.objectForm.user_identity = this.user_identity;
      } else {
        this.objectForm.user_identity = null;
      }
      this.objectForm.sex = type.includes("性别") ? this.sex : null;
      this.objectForm.political_status = type.includes("政治面貌")
        ? this.political_status
        : null;
    },
    getObjectFormdata() {
      this.getOrganizationId();
      //set store
      this.$store.state.school_id = this.objectForm.school_id;
      this.$store.state.college_id = this.objectForm.college_id;
      this.$store.state.class_id = this.objectForm.class_id;
      var data = {};
      for (let item in this.objectForm) {
        if (this.objectForm[item] !== null && this.objectForm[item] !== "") {
          data[item] = this.objectForm[item];
        }
      }
      data.page_id = this.currentPage;
      data.page_size = 20;
      var temp_step_index = [];
      this.objectForm.step_index.forEach((item) => {
        temp_step_index.push(item[1]);
      });
      data.step_index = temp_step_index;
      return data;
    },
    convertObjtable(data) {
      var list = [];
      data.forEach((element) => {
        var item = {};
        item.user_id = element.id;
        item.student_id = element.student_id;
        item.name = element.name;
        var sexSet = {
          1: "男",
          2: "女",
        };
        item.sex = sexSet[element.sex];
        item.education_status = this.convertEducation(element.education_status);
        item.user_identity = this.convertIdentity(element.political_status);
        item.political_status = this.convertPoliticalStatus(
          element.political_status
        );
        item.phone = element.phone;
        list.push(item);
      });
      return list;
    },
    convertEducation(status) {
      let res = null;
      switch (status) {
        case 1:
          res = "本科在读";
          break;
        case 2:
          res = "本科";
          break;
        case 3:
          res = "硕士在读";
          break;
        case 4:
          res = "硕士";
          break;
        case 5:
          res = "博士在读";
          break;
        case 6:
          res = "博士";
          break;
      }
      return res;
    },
    convertPoliticalStatus(status) {
      let res = null;
      switch (status) {
        case 1:
          res = "群众";
          break;
        case 2:
          res = "共青团员";
          break;
        case 6:
          res = "预备党员";
          break;
        case 7:
          res = "党员";
          break;
      }
      return res;
    },
    convertIdentity(status) {
      let res = null;
      switch (status) {
        case 1:
          res = "群众";
          break;
        case 2:
          res = "共青团员";
          break;
        case 3:
          res = "入党申请人";
          break;
        case 4:
          res = "入党积极分子";
          break;
        case 5:
          res = "发展对象";
          break;
        case 6:
          res = "预备党员";
          break;
        case 7:
          res = "党员";
          break;
      }
      return res;
    },
    loadObjdialog(data, prev, next) {
      this.objTable = data;
      var _this = this;
      this.$nextTick(function () {
        this.objTable.forEach((row) => {
          this.$refs.objTableData.toggleRowSelection(row, true);
        });
      });
      _this.objTableLoading = false;
      this.loadPagination(prev, next);
    },
    reloadObjdialog(data, prev, next) {
      var _this = this;
      _this.objTable = data;
      //checked
      if (this.pageFirstComeArray[this.currentIndex] === true) {
        this.pageFirstComeArray[this.currentIndex] = false;
        this.$nextTick(function () {
          this.objTable.forEach((row) => {
            this.$refs.objTableData.toggleRowSelection(row, true);
          });
        });
      } else {
        _this.$nextTick(function () {
          _this.objTable.forEach((row) => {
            if (_this.exclude_user_id_list[row.id] != undefined) {
              _this.$refs.objTableData.toggleRowSelection(row, false);
            } else {
              _this.$refs.objTableData.toggleRowSelection(row, true);
            }
          });
        });
      }
      _this.loadPagination(prev, next);
      this.deleteUnsure();
    },
    loadPagination(prev, next) {
      if (!prev) {
        this.prevDisabled = true;
      } else {
        this.prevDisabled = false;
        this.prev = prev;
      }
      if (!next) {
        this.nextDisabled = true;
      } else {
        this.nextDisabled = false;
        this.next = next;
      }
    },
    Click(type) {
      if (type == 0) {
        this.currentIndex--;
        var url = "http://" + this.prev;
      } else {
        this.currentIndex++;
        var url = "http://" + this.next;
      }
      this.setObject();
      this.reloadObjtable(url);
    },
    deleteUnsure() {
      for (let item in this.objTable) {
        if (this.exclude_user_id_list[this.objTable[item].id] != undefined) {
          this.excludeLength--;
        }
      }
    },
    setObject() {
      var dic = [];
      for (var key in this.objectForm.object) {
        dic[key] = this.objectForm.object[key];
      }
      for (var key in this.objectList_nosure_key) {
        dic[key] = this.objectList_nosure_key[key];
      }
      this.objectForm.object = dic;

      let hasFound = false;
      for (let item in this.objTable) {
        hasFound = false;
        for (let j = 0; j < this.objectList_nosure.length; j++) {
          if (this.objTable[item].id === this.objectList_nosure[j].id) {
            hasFound = true;
            break;
          }
        }
        if (hasFound === false) {
          this.exclude_user_id_list[this.objTable[item].id] = this.objTable[
            item
          ].id;
        }
      }
      this.excludeLength = 0;
      for (let i = 0; i < this.exclude_user_id_list.length; i++) {
        if (this.exclude_user_id_list[i] !== undefined) {
          this.excludeLength++;
        }
      }
    },
    reloadObjtable(url) {
      var _this = this;
      _this.tableLoading = true;
      searchUser_p(url)
        .then((res) => {
          if (res !== false) {
            if (res.data.length > 0) {
              var list = _this.convertObjtable(res.data);
              _this.reloadObjdialog(list, res.previous, res.next);
              _this.tableLoading = false;
            } else {
              _this.msgError("未获取到检索结果！");
            }
          }
        })
        .catch((err) => {
          _this.msgError("未获取到检索结果！");
        });
    },
    handleSelectionChange(val) {
      var form = {};
      this.objectList_nosure = [];
      //去重，避免重复进同一页时会存在重复对象。
      var _this = this;
      val.forEach((item) => {
        if (!form[item.id]) {
          form[item.id] = item.id;
          _this.objectList_nosure.push(item);
        }
      });
      this.objectList_nosure_key = form;
      this.objTableSelected.selected_now = val ? Object.keys(form).length : 0;
    },
    confirmObjects() {
      this.setObject();
      this.objdialogVisible = false;
      this.objectFormVisible = true;
    },
    resetObjForm() {
      this.objType = [];
      this.organizations = [];
      this.objectForm = {
        school_id: null,
        college_id: null,
        class_id: null,
        name: "",
        student_id: null,
        sex: null,
        object: [], //选中总名单字典
      };
      this.totalCount = 0; //选中总名单
      this.objectList_nosure = []; //当前页面选中名单
      this.objectList_nosure_key = []; //当前页面选中名单字典
      this.name = "";
      this.student_id = "";
      this.sex = null;
      this.objTable = [];
      this.prev = null;
      this.next = null;
      this.objTableSelected = {
        selected_now: 0,
        selected_all: 0,
        selected_nosure: 0,
      };

      this.objectFormVisible = true;
    },
    searchFeedback() {
      this.noticeTable = [];
      var _this = this;
      var data = {};
      if (this.searchForm.name) {
        data.keyword = this.searchForm.name;
      }

      this.noticeTableVisible = true;
      this.noticeTableLoading = true;
      searchFeedback(data)
        .then((res) => {
          if (res !== false && res.code == 200) {
            if (res.data.length > 0) {
              var list = _this.convertNoticeTable(res.data);
              _this.total1 = res.count;
              _this.noticeTable = list;
              _this.noticeTableLoading = false;
            } else {
              _this.msgError("未检索到结果！");
              _this.noticeTableLoading = false;
            }
          }
        })
        .catch((err) => {
          _this.msgError("检索失败！");
        });
    },
    convertNoticeTable(data) {
      var list = [];
      data.forEach((it) => {
        var item = {};
        item.origin = it;
        item.name = it.name;
        var typeSet = {
          1: "普通通知",
          2: "会议通知",
          3: "活动通知",
        };
        item.type = typeSet[it.type];
        item.read = it.is_read;

        if (it.type == 2) {
          item.signup = "-";
          item.leave = it.is_ask_off;
        } else if (it.type == 3) {
          item.signup = it.is_sign_up;
          item.leave = "-";
        } else {
          item.signup = "-";
          item.leave = "-";
        }
        item.send = it.count;

        list.push(item);
      });
      return list;
    },
    lookNoticeInfo(data) {
      window.sessionStorage.setItem("noticeInfo", JSON.stringify(data));
      this.$router.push({
        path: "/message/partyAffairs/notice/details",
      });
    },
  },
};
</script>


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
.form {
  padding: 40px 0 0 0;
}
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}
</style>


<style lang="scss" scoped>
.detail {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  .searchTitle {
    width: 100px;
  }
  .content {
    width: 600px;
  }
}
.paginationDiv {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.card {
  .left-box {
    padding: 30px 70px 0 30px;
    width: 50%;
  }

  .right-box {
    padding: 30px 30px 0 70px;
    border-left: 1px solid #ebeef5;
    width: 50%;
  }

  .search-box {
    padding: 30px 30px 0 30px;
  }

  .table-box {
    padding: 30px 30px 0 30px;

    .table {
      margin: 60px 0 60px 0;
    }
  }
}
</style>
