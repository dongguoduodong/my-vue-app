<template>
  <div class="app-container">
    <el-card shadow="never">
      <span class="title">检索谈话</span>
      <el-form
        :label-position="'left'"
        label-width="80px"
        style="margin-top: 20px"
      >
        <el-form-item label="谈话类型">
          <el-select v-model="searchForm.type" placeholder="请选择谈话类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="谈话状态">
          <el-select v-model="searchForm.status" placeholder="请选择谈话状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
            type="primary"
            @click="searchConfirm()"
            style="margin-left: 20px"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>

      <el-divider v-if="tableShow" content-position="center"
        >检索结果</el-divider
      >
      <el-table
        v-if="tableShow"
        element-loading-text="加载中"
        v-loading="tableLoading"
        highlight-current-row
        border
        :data="table"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="name" label="被谈话人姓名"> </el-table-column>
        <el-table-column prop="student_id" label="被谈话人学号">
        </el-table-column>
        <el-table-column prop="type" label="谈话类型"> </el-table-column>
        <el-table-column prop="status" label="谈话状态"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间"> </el-table-column>
        <el-table-column label="详情" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="
                lookInfo(
                  scope.row.record_form_id,
                  scope.row.id,
                  scope.row.user_id
                )
              "
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationDiv" v-if="tableShow">
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

      <el-dialog
        @close="searchConfirm()"
        :title="info.title"
        :visible.sync="infoVisible"
        width="60%"
        center
      >
        <el-form
          style="margin: 0 20px"
          label-width="100px"
          :label-position="'left'"
        >
          <div v-for="item in info.items" :key="item.key">
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'varchar'"
            >
              <el-input v-model="item.default"></el-input>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'text'"
            >
              <!-- <el-input
                type="textarea"
                autosize
                v-model="item.default"
              ></el-input> -->

              <p v-html="item.default"></p>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'integer'"
            >
              <span>{{ item.default }}</span>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'float'"
            >
              <span>{{ item.default }}</span>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'day'"
            >
              <el-date-picker
                v-model="item.default"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'time'"
            >
              <span>{{ item.default }}</span>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'daytime'"
            >
              <span>{{ item.default }}</span>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'choice'"
            >
              <el-select
                v-model="item.default"
                placeholder="请选择性别"
                v-if="item.key === 'sex'"
              >
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>

              <el-select
                v-model="item.default"
                placeholder="请选择民族"
                v-if="item.key == 'nation'"
              >
                <el-option
                  v-for="item in nationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>

              <el-select
                v-model="item.default"
                placeholder="请选择政治面貌"
                v-if="item.key == 'political_status'"
              >
                <el-option
                  v-for="item in politicalOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'image'"
            >
              <div class="image">
                <img :src="item.default" />
              </div>
            </el-form-item>
            <el-form-item
              :prop="item.key"
              :label="item.title"
              v-if="item.type === 'signature'"
            >
              <div style="display: flex">
                <sign-canvas
                  v-if="!showSignUrl"
                  class="sign-canvas"
                  ref="SignCanvas"
                  :options="signOptions"
                  v-model="signUrl"
                />
                <img
                  v-if="showSignUrl"
                  style="object-fit: contain"
                  :src="showSignUrl"
                  width="200"
                  height="150"
                />
                <div v-if="!showSignUrl" style="margin-left: 20px">
                  <el-button
                    id="clear"
                    class="signBtn"
                    @click="canvasClear()"
                    size="small"
                    >清空签名</el-button
                  >
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button type="success" @click="commit">提 交</el-button>
          <el-button @click="infoVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { uploadFile } from "@/api/partyAffairs";
import { getUserInfo } from "@/api/partyMembership";
import { searchTalk, getForm, saveForm, commitForm } from "@/api/conversation";

export default {
  data() {
    return {
      searchForm: {
        type: 1,
        status: 1,
      },
      typeOptions: [
        {
          value: 1,
          label: "入党申请",
        },
      ],
      statusOptions: [
        {
          value: 1,
          label: "未完成",
        },
        {
          value: 2,
          label: "已完成",
        },
      ],
      sexOptions: [
        {
          value: 1,
          label: "男",
        },
        {
          value: 2,
          label: "女",
        },
      ],
      nationOptions: [
        { value: 1, label: "汉族" },
        { value: 2, label: "蒙古族" },
        { value: 3, label: "回族" },
        { value: 4, label: "藏族" },
        { value: 5, label: "维吾尔族" },
        { value: 6, label: "苗族" },
        { value: 7, label: "彝族" },
        { value: 8, label: "壮族" },
        { value: 9, label: "布依族" },
        { value: 10, label: "朝鲜族" },
        { value: 11, label: "满族" },
        { value: 12, label: "侗族" },
        { value: 13, label: "瑶族" },
        { value: 14, label: "白族" },
        { value: 15, label: "土家族" },
        { value: 16, label: "哈尼族" },
        { value: 17, label: "哈萨克族" },
        { value: 18, label: "傣族" },
        { value: 19, label: "黎族" },
        { value: 20, label: "傈僳族" },
        { value: 21, label: "佤族" },
        { value: 22, label: "畲族" },
        { value: 23, label: "高山族" },
        { value: 24, label: "拉祜族" },
        { value: 25, label: "水族" },
        { value: 26, label: "东乡族" },
        { value: 27, label: "纳西族" },
        { value: 28, label: "景颇族" },
        { value: 29, label: "柯尔克孜族" },
        { value: 30, label: "土族" },
        { value: 31, label: "达斡尔族" },
        { value: 32, label: "仫佬族" },
        { value: 33, label: "羌族" },
        { value: 34, label: "布朗族" },
        { value: 35, label: "撒拉族" },
        { value: 36, label: "毛难族" },
        { value: 37, label: "仡佬族" },
        { value: 38, label: "锡伯族" },
        { value: 39, label: "阿昌族" },
        { value: 40, label: "普米族" },
        { value: 41, label: "塔吉克族" },
        { value: 42, label: "怒族" },
        { value: 43, label: "乌孜别克族" },
        { value: 44, label: "俄罗斯族" },
        { value: 45, label: "鄂温克族" },
        { value: 46, label: "崩龙族" },
        { value: 47, label: "保安族" },
        { value: 48, label: "裕固族" },
        { value: 49, label: "京族" },
        { value: 50, label: "塔塔尔族" },
        { value: 51, label: "独龙族" },
        { value: 52, label: "鄂伦春族" },
        { value: 53, label: "赫哲族" },
        { value: 54, label: "门巴族" },
        { value: 55, label: "珞巴族" },
        { value: 56, label: "基诺族" },
        { value: 57, label: "其他" },
        { value: 58, label: "外国血统中国人士" },
      ],
      politicalOptions: [
        { value: 1, label: "群众" },
        {
          value: 2,
          label: "团员",
        },
        {
          value: 3,
          label: "入党申请人",
        },
        {
          value: 4,
          label: "入党积极分子",
        },
        {
          value: 5,
          label: "发展对象",
        },
        {
          value: 6,
          label: "预备党员",
        },
        {
          value: 7,
          label: "党员",
        },
      ],
      tableShow: false,
      tableLoading: false,
      table: [],
      currentPage: 1,
      total: 0,
      info: {
        title: "",
        items: [],
      },
      infoVisible: false,
      form_id: null,
      talk_id: null,
      showSignUrl: null,
      signUrl: null,
      signOptions: {
        canvasWidth: 200,
        canvasHeight: 150,
        isShowBorder: false,
        bgColor: "#f5f5f5",
        writeColor: "#000",
        isSign: true,
        imgType: "png",
      },
      uploadData: {},
      content: {
        signature: "",
      },
      changeCnt: 0,
    };
  },
  created() {
    this.searchConfirm();
  },
  watch: {
    "info.items": {
      handler(val, oldVal) {
        this.changeCnt++;
        if (this.changeCnt > 1) {
          var item = this.info.items[11];
          // talk_time
          item.default = item.default.replace(
            /<span id="talk_time">(.*?)<\/span>/,
            `<span id="talk_time">${this.timestamp2date(
              this.info.items[10].default / 1000
            )}</span>`
          );
          // name
          item.default = item.default.replace(
            /<span id="name1">(.*?)<\/span>/,
            `<span id="name1">${
              this.info.items[2].default ? this.info.items[2].default : "-"
            }</span>`
          );
          item.default = item.default.replace(
            /<span id="name2">(.*?)<\/span>/,
            `<span id="name2">${
              this.info.items[2].default ? this.info.items[2].default : "-"
            }</span>`
          );
          // join_party_at
          item.default = item.default.replace(
            /<span id="join_party_at">(.*?)<\/span>/,
            `<span id="join_party_at">${this.timestamp2date(
              this.info.items[9].default / 1000
            )}</span>`
          );
          this.changeCnt = 1;
        }
      },
      deep: true,
    },
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
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      var _this = this;
      this.tableLoading = true;
      var data = {};
      if (this.searchForm.type) {
        data.type = this.searchForm.type;
      }
      if (this.searchForm.status) {
        data.status = this.searchForm.status;
      }
      data.page_id = this.currentPage;
      data.page_size = 20;
      _this.table = [];
      searchTalk(data)
        .then((res) => {
          if (res !== false) {
            console.log(res);
            if (res.data.length > 0) {
              _this.tableLoading = false;
              _this.table = _this.convertTable(res.data);
            }
          }
        })
        .catch((err) => {
          _this.msgError("获取谈话列表失败！");
        });
    },
    searchConfirm() {
      var _this = this;
      this.tableShow = true;
      this.tableLoading = true;
      this.currentPage = 1;
      var data = {};
      if (this.searchForm.type) {
        data.type = this.searchForm.type;
      }
      if (this.searchForm.status) {
        data.status = this.searchForm.status;
      }
      data.page_id = this.currentPage;
      data.page_size = 20;
      this.table = [];
      searchTalk(data)
        .then((res) => {
          if (res !== false) {
            if (res.data.length > 0) {
              _this.table = _this.convertTable(res.data);
            }
            _this.tableLoading = false;
          }
        })
        .catch((err) => {
          _this.msgError("获取谈话列表失败！");
        });
    },
    convertTable(data) {
      var list = [];
      data.forEach((item) => {
        var i = {};
        i.id = item.id;
        i.name = item.student_name;
        i.student_id = item.student_id;
        i.type = item.type == 1 ? "入党申请" : "-";
        i.status = item.status == 1 ? "未完成" : "已完成";
        i.create_time = this.convertTime(item.create_at);
        i.record_form_id = item.record_form_id;
        i.user_id = item.user_id;
        list.push(i);
      });
      return list;
    },
    convertTime(timestamp) {
      var time = new Date(timestamp * 1000);
      return (
        time.toLocaleDateString().replace(/\//g, "-") +
        " " +
        time.toTimeString().substr(0, 5)
      );
    },
    lookInfo(form_id, talk_id, user_id) {
      var _this = this;
      this.form_id = form_id;
      this.talk_id = talk_id;
      this.info = {};
      this.infoVisible = false;
      this.showSignUrl = false;
      this.signUrl = null;
      this.content.signature = null;
      getForm(this.form_id)
        .then((res) => {
          if (res !== false) {
            _this.info.title = res.data.title;
            res.data.items.forEach((item) => {
              if (item.type === "image") {
                item.default =
                  "http://101.34.237.153:7000/fastapi/v1/api/files/" + item.default;
              }
              if (item.type === "signature") {
                _this.showSignUrl = item.default
                  ? "http://101.34.237.153:7000/fastapi/v1/api/files/" +
                    item.default
                  : null;
              }
              if (
                item.key === "birthday" ||
                item.key === "join_party_at" ||
                item.key === "talk_time"
              ) {
                item.default = item.default * 1000;
              }
            });
            _this.$set(_this.info, "items", res.data.items);

            getUserInfo(user_id).then((res) => {
              if (res !== false) {
                _this.info.items.forEach((item) => {
                  if (item.default == "" || item.default == null) {
                    if (item.key !== "record" && item.key !== "signature") {
                      if (
                        res.data[item.key] !== "" &&
                        res.data[item.key] !== null
                      ) {
                        _this.$set(item, "default", res.data[item.key]);
                      }
                    }
                  }
                });
              }
            });

            console.log(this.info.items[11]);

            this.changeCnt = 0;
            var item = this.info.items[11];
            item.default = item.default.replace(/</g, "[");
            item.default = item.default.replace(/>/g, "]");
            // talk_time
            item.default = item.default.replace(
              /\[(.*?)\]/,
              `<span id="talk_time">${this.timestamp2date(
                this.info.items[10].default / 1000
              )}</span>`
            );
            // name
            item.default = item.default.replace(
              /\[(.*?)\]/,
              `<span id="name1">${
                this.info.items[2].default ? this.info.items[2].default : "-"
              }</span>`
            );
            item.default = item.default.replace(
              /\[(.*?)\]/,
              `<span id="name2">${
                this.info.items[2].default ? this.info.items[2].default : "-"
              }</span>`
            );
            // join_party_at
            item.default = item.default.replace(
              /\[(.*?)\]/,
              `<span id="join_party_at">${this.timestamp2date(
                this.info.items[9].default / 1000
              )}</span>`
            );
            console.log(item.default);

            _this.infoVisible = true;
          }
        })
        .catch((err) => {
          _this.msgError("获取表格失败!");
        });
    },
    convertPoliticalStatus(status) {
      let idSet = {
        1: "群众",
        2: "团员",
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
    convertNation(nation) {
      var nationSet = {
        1: "汉族",
        2: "蒙古族",
        3: "回族",
        4: "藏族",
        5: "维吾尔族",
        6: "苗族",
        7: "彝族",
        8: "壮族",
        9: "布依族",
        10: "朝鲜族",
        11: "满族",
        12: "侗族",
        13: "瑶族",
        14: "白族",
        15: "土家族",
        16: "哈尼族",
        17: "哈萨克族",
        18: "傣族",
        19: "黎族",
        20: "傈僳族",
        21: "佤族",
        22: "畲族",
        23: "高山族",
        24: "拉祜族",
        25: "水族",
        26: "东乡族",
        27: "纳西族",
        28: "景颇族",
        29: "柯尔克孜族",
        30: "土族",
        31: "达斡尔族",
        32: "仫佬族",
        33: "羌族",
        34: "布朗族",
        35: "撒拉族",
        36: "毛难族",
        37: "仡佬族",
        38: "锡伯族",
        39: "阿昌族",
        40: "普米族",
        41: "塔吉克族",
        42: "怒族",
        43: "乌孜别克族",
        44: "俄罗斯族",
        45: "鄂温克族",
        46: "崩龙族",
        47: "保安族",
        48: "裕固族",
        49: "京族",
        50: "塔塔尔族",
        51: "独龙族",
        52: "鄂伦春族",
        53: "赫哲族",
        54: "门巴族",
        55: "珞巴族",
        56: "基诺族",
        57: "其他",
        58: "外国血统中国人士",
      };
      if (nation) {
        return nationSet[nation];
      } else {
        return null;
      }
    },
    convertBirthday(timestamp) {
      if (timestamp) {
        var time = new Date(timestamp * 1000);
        var year = time.getFullYear() + " 年";
        var month = time.getMonth() + 1 + " 月";
        var date = time.getDate() + " 日";
        return [year, month, date].join(" ");
      } else {
        return null;
      }
    },
    save() {
      var _this = this;
      var data = {};
      data.id = this.form_id;
      data.talk_id = this.talk_id;
      data.content = {};
      this.info.items.forEach((item) => {
        if (item.default == "" || item.default == null) {
          if (item.key !== "signature") {
            _this.msgError("请将表单填写完整后再保存！");
            throw new Error();
          }
        } else {
          if (item.key === "record") {
            this.changeCnt = -1;
            var record = JSON.parse(
              JSON.stringify(item.default.replace(/<span(.*?)>/g, "<"))
            );
            record = JSON.parse(
              JSON.stringify(record.replace(/<\/span>/g, ">"))
            );
            item.default = record;
          }
          _this.$set(_this.content, item.key, item.default);
        }
      });
      if (!this.showSignUrl) {
        this.saveAsImg();
      }
      this.content.birthday = this.content.birthday / 1000;
      this.content.join_party_at = this.content.join_party_at / 1000;
      this.content.talk_time = this.content.talk_time / 1000;
      data.content = this.content;
      setTimeout(() => {
        saveForm(data)
          .then((res) => {
            if (res !== false) {
              _this.msgSuccess("保存表单成功！");
            }
          })
          .catch((err) => {
            _this.msgError("保存表单失败！");
          });
      }, 1000);
    },
    commit() {
      var _this = this;
      commitForm(this.form_id)
        .then((res) => {
          if (res !== false) {
            _this.msgSuccess("提交表单成功！");
          }
        })
        .catch((err) => {
          _this.msgError("提交表单失败！");
        });
    },
    canvasClear() {
      this.showSignUrl = false;
      this.$refs.SignCanvas[0].canvasClear();
    },
    saveAsImg() {
      const img = this.$refs.SignCanvas[0].saveAsImg();
      let binary = atob(img.split(",")[1]);
      let mime = img.split(",")[0].match(/:(.*?);/)[1];
      let array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      let fileData = new Blob([new Uint8Array(array)], { type: mime });
      let file = new File([fileData], `${new Date().getTime()}.png`, {
        type: mime,
      });
      let param = new FormData();
      param.append("files", file);
      uploadFile(param).then((res) => {
        if (res !== false) {
          this.content.signature = res[0].file_address;
          this.$message.success({ showClose: true, message: "签名保存成功！" });
        }
      });
    },
    timestamp2date(timestamp) {
      if (timestamp) {
        var time = new Date(timestamp * 1000);
        var year = time.getFullYear() + " 年";
        var month = time.getMonth() + 1 + " 月";
        var date = time.getDate() + " 日";
        return [year, month, date].join(" ");
      } else {
        return "*年*月*日";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.paginationDiv {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
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
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.el-input {
  width: 220px;
}
</style>
