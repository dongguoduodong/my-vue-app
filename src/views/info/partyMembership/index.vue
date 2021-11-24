<template>
  <div class="app-container">
    <el-card shadow="never" class="party-page" v-if="!$route.meta.showDetail">
      <div class="inExport-box">
        <span class="title">管理人员</span>
        <div class="btnDiv">
          <el-button type="primary">批量导入</el-button>
          <input type="file" @change="onChange($event)" />
          <el-button @click="exportExcel" type="primary" class="exportDiv"
            >批量导入示例</el-button
          >
        </div>
        <div class="uploadBody" v-show="this.isShow">
          <div v-for="item in uploadFileList" :key="item.id" class="item">
            <p>{{ item.name }}</p>
          </div>
          <el-button @click="upload" type="primary">上传</el-button>
        </div>
      </div>
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
                  <p>政治面貌：</p>
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
                    <el-checkbox :label="5">助教</el-checkbox>
                    <el-checkbox :label="6">未评定</el-checkbox>
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
          <!-- <el-table-column type="selection" width="50"> </el-table-column> -->
          <el-table-column prop="student_id" label="学号/工号">
          </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="sex" label="性别"> </el-table-column>
          <el-table-column prop="user_identity" label="身份"> </el-table-column>
          <el-table-column
            prop="political_status"
            label="政治面貌"
          ></el-table-column>
          <el-table-column
            prop="education_status"
            label="学历"
          ></el-table-column>
          <el-table-column prop="phone" label="联系方式"> </el-table-column>
          <el-table-column label="详情" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="lookInfo(scope.row.user_id)"
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
    </el-card>
    <router-view></router-view>
  </div>
</template>

<script>
import { organizations } from "@/api/partyMembership";
import { searchUser } from "@/api/partyMembership";
import { exportExcel } from "@/api/partyMembership";
import { uploadExcel1 } from "@/api/partyMembership";
import { uploadExcel2 } from "@/api/partyMembership";
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
      isShow: false,
      uploadFileList: [],
      currentPage: 1,
      total: 0,
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
    exportExcel() {
      exportExcel();
      this.$message.success("下载成功！");
    },
    onChange(e) {
      this.isShow = true;
      let file = e.target.files[0];
      let type = file.name.split(".")[1];
      if (type !== "xlsx" && type !== "xls") {
        this.$message.error("请上传后缀为xlsx或xls的表格文件！");
        this.isShow = false;
      } else {
        this.uploadFileList.push(file);
        let _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          _this.imgUrl = this.result;
        };
      }
    },
    upload() {
      let param = new FormData();
      this.uploadFileList.forEach((item) => {
        param.append("files", item);
      });
      uploadExcel1(param).then((res) => {
        if (res !== false) {
          let param2 = {
            filename: res[0].file_address,
          };
          uploadExcel2(param2).then((res) => {
            if (res !== false) {
              if (res.data.ok === true) {
                this.$alert("导入成功！", "", {
                  dangerouslyUseHTMLString: true,
                  callback: (action) => {
                    location.reload();
                  },
                });
              } else {
                let errorArray = "";
                errorArray += "<p>导入失败！</p>";
                for (let item in res.data.errors) {
                  errorArray += "<p>" + res.data.errors[item] + "</p>";
                }
                this.$alert(errorArray, "", {
                  dangerouslyUseHTMLString: true,
                  callback: (action) => {
                    location.reload();
                  },
                });
              }
            }
          });
        }
      });
      this.isShow = false;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      var _this = this;
      if (_this.organizations.length <= 0) {
        _this.msgError("请选择检索对象后再进行检索！");
      } else {
        var data = _this.getObjectFormdata();
        searchUser(data)
          .then((res) => {
            if (res !== false) {
              _this.tableVisible = true;
              _this.tableLoading = true;
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
    lookInfo(user_id) {
      this.$router.push({
        path: "/info/partyMembership/details",
        query: { id: user_id },
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
            _this.msgError("检索失败！");
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
        item.education_status = this.convertEducation(element.education_status);
        item.user_identity = this.convertIdentity(element.political_status);
        item.political_status = this.convertPoliticalStatus(
          element.political_status
        );
        item.user_identity = this.convertIdentity(element.title_status);
        item.political_status = this.convertPoliticalStatus(element.political_status);
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
          // res = "群众"
          res = "学生"
          break
        case 2:
          // res = "共青团员"
          res = "教师"
          break
        case 3:
          // res = "入党申请人"
          res = "教师"
          break
        case 4:
          // res = "入党积极分子"
          res = "教师"
          break
        case 5:
          // res = "发展对象"
          res = "教师"
          break
        case 6:
          // res = "预备党员"
          res = "教师"
          break
        // case 7:
        //   res = "党员"
        default:
          res = "暂无数据"
          break
      }
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
.inExport-box {
  margin-bottom: 40px;
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
  line-height: 40px;
}
::v-deep .el-checkbox-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.btnDiv {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  input {
    width: 100px;
    height: 40px;
    opacity: 0;
    position: absolute;
    cursor: pointer;
  }
  .exportDiv {
    margin-left: 20px;
    z-index: 10;
  }
}
.paginationDiv {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.app-container {
  .party-page {
    .table-box {
      padding: 30px 0;

      .table {
        margin: 60px 0 60px 0;
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