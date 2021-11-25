<template>
  <el-card shadow="never" class="container" v-if="$route.meta.showDetail">
    <el-row>
      <el-col :span="1">
        <i
          class="el-icon-back"
          style="padding: 16px 0; cursor: pointer"
          @click="handleReturn"
        ></i>
      </el-col>

      <el-col :span="23" class="info-container">
        <!-- 个人信息 -->
        <el-divider content-position="left">个人信息</el-divider>
        <el-form
          v-model="infoTable"
          :label-position="'left'"
          label-width="100px"
          style="padding: 0 40px 1px 40px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名">
                <span class="value">{{ infoTable.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别">
                <span class="value">{{ infoTable.sex }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="学号">
                <span class="value">{{ infoTable.student_id }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号码">
                <span class="value">{{ infoTable.id_card }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="生日">
                <span class="value">{{ infoTable.birthday }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="民族">
                <span class="value">{{ infoTable.nation }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="籍贯">
                <span class="value">{{ infoTable.hometown }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号">
                <span class="value">{{ infoTable.phone }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="电子邮箱">
                <span class="value">{{ infoTable.email }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址">
                <span class="value">{{ infoTable.address }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="主修专业">
                <span class="value">{{ infoTable.major }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学历">
                <span class="value">{{ infoTable.education_status }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职称">
                <span class="value">{{ infoTable.title_status }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="政治情况">
                <span class="value">{{ infoTable.political_status }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="组织">
            <span class="value">
              {{
                infoTable.school +
                " - " +
                infoTable.college +
                " - " +
                infoTable.class
              }}</span
            >
          </el-form-item>
        </el-form>

        <!-- 谈话记录表 -->
        <el-divider content-position="left">谈话记录表</el-divider>
        <div style="padding: 10px 40px">
          <el-form id="printDiv">
            <div class="form">
              <el-form-item>
                <h3>{{ evidence.title }}</h3>
              </el-form-item>
              <div
                class="el-item"
                v-for="item in evidence.items"
                :key="item.key"
              >
                <el-form-item :prop="item.key" v-if="item.type === 'varchar'">
                  <p>{{ item.title }}</p>
                  <p>{{ item.default }}</p>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'text'">
                  <p>{{ item.title }}</p>
                  <p>{{ item.default }}</p>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'integer'">
                  <p>{{ item.title }}</p>
                  <p>{{ item.default }}</p>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'float'">
                  <p>{{ item.title }}</p>
                  <p>{{ item.default }}</p>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'day'">
                  <p>{{ item.title }}</p>
                  <p>{{ item.default }}</p>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'time'">
                  <p>{{ item.title }}</p>
                  <p>{{ item.default }}</p>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'daytime'">
                  <p>{{ item.title }}</p>
                  <p>{{ item.default }}</p>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'choice'">
                  <p>{{ item.title }}</p>
                  <p>{{ item.default }}</p>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'image'">
                  <p>{{ item.title }}</p>
                  <div class="image">
                    <img :src="item.default" />
                  </div>
                </el-form-item>
                <el-form-item :prop="item.key" v-if="item.type === 'signature'">
                  <p>{{ item.title }}</p>
                  <div class="image">
                    <img :src="item.default" />
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>

        <!-- 审批 -->
        <div v-if="sign_id">
          <el-divider content-position="left">审批</el-divider>
          <el-form
            :label-position="'left'"
            label-width="100px"
            style="padding: 10px 40px"
          >
            <el-form-item label="意见">
              <el-input
                style
                type="textarea"
                :rows="3"
                placeholder="请输入修改意见"
                v-model="approveText"
                maxlength="100"
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <div style="margin-top: 20px">
              <el-button type="primary" @click="signPass(sign_id)"
                >通 过</el-button
              >
              <el-button
                type="danger"
                style="margin-left: 20px"
                @click="signReject(sign_id)"
                >驳 回</el-button
              >
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getUserInfo, signPass, signReject } from "@/api/partyMembership";
import { getForm, searchUser, getStep } from "@/api/conversation";

export default {
  data() {
    return {
      infoTable: {},
      evidence: {
        title: "",
        items: [],
      },
      imageUrl: null,
      signUrl: null,
      approveText: "",
      sign_id: null,
    };
  },
  created() {
    this.user_id = this.$route.query.user_id;
    this.form_id = this.$route.query.form_id;
    this.getUserInfo();
    this.getForm();
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
    handleReturn() {
      this.$router.go(-1);
    },
    getUserInfo() {
      var _this = this;
      getUserInfo(this.user_id)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.infoTable = _this.convertTable(res.data);

            var step_id = null;
            //get step_id
            searchUser({
              is_fuzzy: false,
              class_id: _this.infoTable.class_id,
              keyword_student_id: _this.infoTable.student_id,
            }).then((res) => {
              if (res !== false) {
                step_id = res.data[0].step_id;
                //get sign_id
                getStep({ step_id: step_id }).then((res) => {
                  if (res !== false) {
                    _this.sign_id = res.data.sign_id;
                  }
                });
              }
            });
          }
        })
        .catch((err) => {
          _this.msgError("获取个人详细信息失败！");
        });
    },
    convertTable(data) {
      var table = {};
      table.name = data.name;
      var sexSet = {
        1: "男",
        2: "女",
      };
      table.sex = sexSet[data.sex];
      table.phone = data.phone;
      table.student_id = data.student_id;
      table.email = data.email;
      table.major = data.major;
      table.hometown = data.hometown;
      var educationSet = {
        1: "本科在读",
        2: "本科",
        3: "硕士在读",
        4: "硕士",
        5: "博士在读",
        6: "博士",
      };
      table.education_status = educationSet[data.education_status];
      var titleSet = {
        1: "学生",
        2: "讲师",
        3: "副教授",
        4: "教授",
      };
      table.title_status = titleSet[data.title_status];
      table.political_status = this.convertPoliticalStatus(
        data.political_status
      );
      table.id_card = data.IDCard;
      table.address = data.address;
      table.nation = this.convertNation(data.nation);
      table.birthday = this.convertBirthday(data.birthday);
      table.school = data.school_name;
      table.college = data.college_name;
      table.class = data.class_name;
      table.school_id = data.school_id;
      table.college_id = data.college_id;
      table.class_id = data.class_id;
      return table;
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
    getForm() {
      getForm(this.form_id).then((res) => {
        if (res !== false) {
          res.data.items.forEach((item) => {
            if (item.type === "image") {
              item.default =
                "http://101.34.237.153:7000/fastapi/v1/api/files/" + item.default;
            }
            if (item.type === "signature") {
              item.default =
                "http://101.34.237.153:7000/fastapi/v1/api/files/" + item.default;
            }
            if (item.key === "sex") {
              let sexSet = {
                1: "男",
                2: "女",
              };
              item.default = sexSet[item.default];
            }
            if (item.key === "education_status") {
              let educationSet = {
                1: "本科在读",
                2: "本科",
                3: "硕士在读",
                4: "硕士",
                5: "博士在读",
                6: "博士",
              };
              item.default = educationSet[item.default];
            }
            if (item.key === "nation") {
              item.default = this.convertNation(item.default);
            }
            if (item.key === "birthday" || item.key === "join_party_at") {
              item.default = this.convertBirthday(item.default);
            }
            if (item.key === "political_status") {
              item.default = this.convertPoliticalStatus(item.default);
            }
          });
          this.evidence = res.data;
        }
      });
    },
    signPass(sign_id) {
      var _this = this;
      signPass(sign_id, this.approveText)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.msgSuccess("通过审核成功！");
          }
        })
        .catch((err) => {
          _this.msgError("通过审批失败！");
        });
    },
    signReject(sign_id) {
      var _this = this;
      signReject(sign_id, this.approveText)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.msgSuccess("驳回审批成功！");
          }
        })
        .catch((err) => {
          _this.msgError("驳回审批失败！");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0px !important;

  .info-container {
    padding: 0 20px 0 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 16px;
    padding: 16px;
    border: 1px solid #999;
    .el-item {
      width: 100%;
      ::v-deep .el-form-item__content {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        p {
          width: 50%;
        }
        .image {
          width: 50%;
          img {
            width: 100px;
            object-fit: contain;
          }
        }
      }
      ::v-deep .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>

<style>
.value {
  color: #c0c4cc;
  font-weight: 400;
}
</style>