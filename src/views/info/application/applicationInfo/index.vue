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
                <p class="value">{{ infoTable.name }}</p>
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
                <span class="value">{{ infoTable.IDCard }}</span>
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
                infoTable.school_name +
                " - " +
                infoTable.college_name +
                " - " +
                infoTable.class_name
              }}</span
            >
          </el-form-item>
        </el-form>

        <!-- 入党申请书 -->
        <el-divider content-position="left">入党申请书</el-divider>
        <div style="display: inline-block;padding: 10px 40px;line-height: 28px;font-size: 14px;" class="value">
          <p v-for="(item,index) in applicationText" :key="index"> {{ index+1 + '. ' + item }}</p>
        </div>

        <!-- 入党信息表 -->
        <el-divider content-position="left">入党信息表</el-divider>
        <div style="padding: 10px 40px">
        <el-form id="printDiv" v-if="this.result.has_sign === '是'">
          <div class="form" v-for="(evidence, index) in evidences" :key="index">
            <el-form-item>
              <h3>{{evidence.title}}</h3>
            </el-form-item>
            <div class="el-item" v-for="item in evidence.items" :key="item.key">
              <el-form-item :prop="item.key" v-if="item.type === 'varchar'">
                <p>{{item.title}}</p>
                <p>{{item.default}}</p>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'text'">
                <p>{{item.title}}</p>
                <p>{{item.default}}</p>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'integer'">
                <p>{{item.title}}</p>
                <p>{{item.default}}</p>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'float'">
                <p>{{item.title}}</p>
                <p>{{item.default}}</p>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'day'">
                <p>{{item.title}}</p>
                <p>{{item.default}}</p>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'time'">
                <p>{{item.title}}</p>
                <p>{{item.default}}</p>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'daytime'">
                <p>{{item.title}}</p>
                <p>{{item.default}}</p>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'choice'">
                <p>{{item.title}}</p>
                <p>{{item.default}}</p>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'image'">
                <p>{{item.title}}</p>
                <div class="image">
                  <img :src="item.default">
                </div>
              </el-form-item>
              <el-form-item :prop="item.key" v-if="item.type === 'signature'">
                <p>{{item.title}}</p>
                <div class="image">
                  <img :src="item.default">
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
        </div>

        <!-- 审批 -->
        <el-divider content-position="left">审批</el-divider>
        <p v-if="this.result.has_sign !== '是'">该用户还未发起进入下一阶段的请求，无法审批</p>
        <el-form  v-if="this.result.has_sign === '是'"
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
            <el-button type="primary" @click="signPass(sign_id)">通 过</el-button>
            <el-button type="danger" style="margin-left: 20px" @click="signReject(sign_id)">驳 回</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getInfo, getStep, getFrom } from "@/api/application";
import { signPass } from "@/api/partyMembership";
import { signReject } from "@/api/partyMembership";

export default {
  data() {
    return {
      result: null,
      evidences: [],
      infoTable: {},
      applicationText: [],
      approveText: null,
      sign_id: null,
    };
  },
  created() {
    this.result = this.$route.query;
    this.getUserInfo();
    this.getUserStep();
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
    getUserInfo () {
      getInfo({ op_user_id: this.result.user_id }).then(res => {
        if (res !== false) {
          let sexSet = {
            1: "男",
            2: "女",
          };
          res.data.sex = sexSet[res.data.sex];
          let educationSet = {
            1: "本科在读",
            2: "本科",
            3: "硕士在读",
            4: "硕士",
            5: "博士在读",
            6: "博士",
          };
          res.data.education_status = educationSet[res.data.education_status];
          let titleSet = {
            1: "学生",
            2: "讲师",
            3: "副教授",
            4: "教授",
          };
          res.data.title_status = titleSet[res.data.title_status];
          res.data.nation = this.convertNation(res.data.nation);
          res.data.birthday = this.convertBirthday(res.data.birthday);
          res.data.political_status = this.convertPoliticalStatus(res.data.political_status);
          this.infoTable = res.data;
        }
      })
    },
    getUserStep () {
      getStep({step_id: this.result.step_id}).then(res => {
        if (res !== false) {
          let formID = null
          this.sign_id = res.data.sign_id;
          res.data.evidence_data.forEach(element => {
            if (element.ref_obj_type === 3) {
              formID = element.ref_obj_id
              getFrom({ form_id: formID }).then(res => {
                if (res !== false) {
                  res.data.items.forEach(item => {
                    if (item.type === 'image') {
                      item.default = 'http://121.196.146.231/fastapi/v1/api/files/' + item.default
                    }
                    if (item.type === 'signature') {
                      item.default = 'http://121.196.146.231/fastapi/v1/api/files/' + item.default
                    }
                    if (item.key === 'sex') {
                      let sexSet = {
                        1: "男",
                        2: "女",
                      };
                      item.default = sexSet[item.default];
                    }
                    if (item.key === 'education_status') {
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
                    if (item.key === 'nation') {
                      item.default = this.convertNation(item.default);
                    }
                    if (item.key === 'birthday' || item.key === 'join_party_at') {
                      item.default = this.convertBirthday(item.default);
                    }
                    if (item.key === 'political_status') {
                      console.log(item)
                      let idSet = {
                        1: "群众",
                        2: "团员",
                        3: "入党申请人",
                        4: "入党积极分子",
                        5: "发展对象",
                        6: "预备党员",
                        7: "党员",
                      };
                      item.default = idSet[item.default];
                    }
                  })
                  this.evidences.push(res.data);
                }
              })
            }
            if (element.ref_obj_type === 2) {
              this.applicationText.push(element.description)
            }
          });
        }
      })
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
    signPass(sign_id) {
      var _this = this;
      signPass(sign_id, this.approveText)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.msgSuccess("通过审核成功！");
            _this.dialogVisible = false;
            _this.getUserStep(_this.user_id);
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
            _this.dialogVisible = false;
            _this.getUserStep(_this.user_id);
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

  .ctrl-container {
    padding: 36px 0;

    .button {
      display: table;
      margin: 0 auto;
      margin-top: 20px;
    }
  }
}
::v-deep .el-form-item__content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  line-height: 40px;
}
.form{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 16px;
  padding: 16px;
  border: 1px solid #999;
  .el-item{
    width: 100%;
    ::v-deep .el-form-item__content{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      p{
        width: 50%;
      }
      .image{
        width: 50%;
        img{
          width: 100px;
          object-fit: contain;
        }
      }
    }
    ::v-deep .el-form-item{
      margin-bottom: 10px;
    }
  }
}
</style>

<style>
.value {
  color: #c0c4cc;
  font-weight: 400;
  margin: 0;
}
</style>