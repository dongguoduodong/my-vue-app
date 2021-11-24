<template>
  <div class="app-container">
    <el-card shadow="never">
      <!-- search-box -->
      <div class="search-box">
        <span class="title">检索人员</span>
        <el-form
          v-model="objectForm"
          class="form"
          :label-position="'left'"
          label-width="100px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="检索范围">
                <el-cascader
                  v-model="organizations"
                  :options="organizationsOptions"
                  :props="organizationsProps"
                  style="width: 380px"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
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
          <el-form-item label="模糊搜索" v-if="objectForm.is_fuzzy === true">
            <div>
              <div class="detail">
                <div class="searchTitle">
                  <p>性别：</p>
                </div>
                <div class="content">
                  <el-radio v-model="objectForm.sex" :label="1">男</el-radio>
                  <el-radio v-model="objectForm.sex" :label="2">女</el-radio>
                </div>
              </div>
              <div class="detail">
                <div class="searchTitle">
                  <p>职务：</p>
                </div>
                <div class="content">
                  <el-checkbox-group v-model="objectForm.position_id_list">
                    <el-checkbox
                      v-for="item in this.position_id_list"
                      :key="item.id"
                      :label="item.id"
                      >{{ item.name }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </div>
              <div class="detail" v-if="objectForm.step_index.length === 0">
                <div class="searchTitle">
                  <p>政治情况：</p>
                </div>
                <div class="content">
                  <el-checkbox-group v-model="objectForm.political_status">
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
                  <el-checkbox-group v-model="objectForm.education_status">
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
          <el-form-item label="精确搜索" v-if="objectForm.is_fuzzy === false">
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
        </el-form>
        <el-button @click="searchObject" type="primary">检 索</el-button>
      </div>

      <!-- table -->
      <div
        class="table-box"
        v-if="tableVisible"
        element-loading-text="加载中"
        v-loading="tableLoading"
        highlight-current-row
      >
        <el-divider content-position="center">检索结果</el-divider>
        <el-table border :data="table" class="table">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="student_id" label="学号/工号">
          </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="sex" label="性别"> </el-table-column>
          <el-table-column prop="upload_time" label="上传时间">
          </el-table-column>
          <el-table-column label="缴费材料" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="lookInfo(scope.row.pic_src)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationDiv">
          <el-pagination
            layout="prev, pager, next"
            :page-size="20"
            :current-page="currentPage"
            background
            :total="total"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>

      <!-- dialog -->
      <el-dialog
        title="缴费资料"
        :visible.sync="dialogVisible"
        width="50%"
        center
      >
        <el-image class="img" :src="pic_src"></el-image>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { organizations } from "@/api/payment";
import { searchUser } from "@/api/payment";
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
      currentPage: 1,
      total: 0,
      organizations: [1],
      organizationsOptions: [],
      organizationsProps: {
        lazy: true,
        // multiple: true,
        checkStrictly: true,
        lazyLoad: (node, resolve) => {
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
      table: [],
      tableVisible: false,
      tableLoading: false,
      dialogVisible: false,
      pic_src: [],
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
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      var _this = this;
      if (_this.organizations.length <= 0) {
        _this.msgError("请选择查看对象后再进行检索！");
      } else {
        var data = _this.getObjectFormdata();
        searchUser(data)
          .then((res) => {
            _this.tableVisible = true;
            _this.tableLoading = true;
            if (res !== false) {
              if (res.data.length > 0) {
                var list = _this.convertTable(res.data);
                _this.total = res.count;
                _this.table = list;
                _this.tableLoading = false;
              } else {
                _this.msgError("未获取到检索结果！");
              }
            }
          })
          .catch((err) => {
            _this.msgError("检索失败！");
          });
      }
    },
    msgError(msg) {
      this.$message.error(msg);
    },
    msgSuccess(msg) {
      this.$message({
        message: msg,
        type: "success",
      });
    },
    searchObject() {
      var _this = this;
      this.currentPage = 1;
      if (_this.organizations.length <= 0) {
        _this.msgError("请选择检索对象后再进行检索！");
      } else {
        var data = _this.getObjectFormdata();
        searchUser(data)
          .then((res) => {
            _this.tableVisible = true;
            _this.tableLoading = true;
            if (res !== false) {
              var list = _this.convertTable(res.data);
              _this.total = res.count;
              _this.table = list;
            }
            _this.tableLoading = false;
          })
          .catch((err) => {
            _this.msgError("请求失败！");
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
    convertTable(data) {
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
        item.upload_time = this.convertTime(element.create_at);
        item.pic_src = "http://" + element.url;
        list.push(item);
      });
      return list;
    },
    convertEducation(status) {
      let idSet = {
        1: "本科在读",
        2: "本科",
        3: "硕士在读",
        4: "硕士",
        5: "博士在读",
        6: "博士",
      };
      for (let id in idSet) {
        return status + "" === id + "" ? idSet[id] : "";
      }
    },
    convertPoliticalStatus(status) {
      let idSet = {
        1: "群众",
        2: "共青团员",
        6: "预备党员",
        7: "党员",
      };
      for (let id in idSet) {
        return status + "" === id + "" ? idSet[id] : "";
      }
    },
    convertIdentity(status) {
      var idSet = {
        1: "群众",
        2: "共青团员",
        3: "入党申请人",
        4: "入党积极分子",
        5: "发展对象",
        6: "预备党员",
        7: "党员",
      };
      for (let id in idSet) {
        return status + "" === id + "" ? idSet[id] : "";
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
    lookInfo(pic_src) {
      var _this = this;
      this.pic_src = pic_src;
      _this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.paginationDiv {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.app-container {
  .table-box {
    padding: 30px 0;

    .table {
      margin: 60px 0 60px 0;
    }
  }

  .img {
    display: table;
    margin: 0 auto;
  }
}
.detail {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  .searchTitle {
    width: 80px;
  }
  .content {
    width: 600px;
  }
}
::v-deep .el-form-item__content {
  line-height: 20px;
}
::v-deep .el-checkbox-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
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