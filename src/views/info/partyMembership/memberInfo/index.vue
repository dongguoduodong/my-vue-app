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

      <el-col :span="19" class="info-container">
        <!-- 个人信息 -->
        <el-divider content-position="left">个人信息</el-divider>
        <el-form
          v-model="infoTable"
          :label-position="'left'"
          label-width="100px"
          style="padding: 0 40px"
        >
          <el-form-item label="姓名">
            <span class="value" v-show="!edit">{{ infoTable.name }}</span>
            <el-input v-show="edit" v-model="infoTable_reset.name"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <span class="value" v-show="!edit">{{ infoTable.sex }}</span>
            <el-select
              v-model="infoTable_reset.sex"
              placeholder="请选择性别"
              v-show="edit"
            >
              <el-option
                v-show="edit"
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学号">
            <span class="value" v-show="!edit">{{ infoTable.student_id }}</span>
            <el-input
              v-show="edit"
              v-model="infoTable_reset.student_id"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号码">
            <span class="value" v-show="!edit">{{ infoTable.id_card }}</span>
            <el-input v-show="edit" v-model="infoTable_reset.IDCard"></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <span class="value" v-show="!edit">{{ infoTable.birthday }}</span>
            <el-date-picker
              v-show="edit"
              v-model="infoTable_reset.birthday"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="民族">
            <span class="value" v-show="!edit">{{ infoTable.nation }}</span>
            <el-select
              v-model="infoTable_reset.nation"
              placeholder="请选择民族"
              v-show="edit"
            >
              <el-option
                v-for="item in nationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="籍贯">
            <span class="value" v-show="!edit">{{ infoTable.hometown }}</span>
            <el-input
              v-show="edit"
              v-model="infoTable_reset.hometown"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <span class="value" v-show="!edit">{{ infoTable.phone }}</span>
            <el-input v-show="edit" v-model="infoTable_reset.phone"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <span class="value" v-show="!edit">{{ infoTable.email }}</span>
            <el-input v-show="edit" v-model="infoTable_reset.email"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <span class="value" v-show="!edit">{{ infoTable.address }}</span>
            <el-input
              v-show="edit"
              v-model="infoTable_reset.address"
            ></el-input>
          </el-form-item>
          <el-form-item label="主修专业">
            <span class="value" v-show="!edit">{{ infoTable.major }}</span>
            <el-input v-show="edit" v-model="infoTable_reset.major"></el-input>
          </el-form-item>
          <el-form-item label="学历">
            <span class="value" v-show="!edit">{{
              infoTable.education_status
            }}</span>
            <el-select
              v-model="infoTable_reset.education_status"
              placeholder="请选择学历"
              v-show="edit"
            >
              <el-option
                v-for="item in educationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称">
            <span class="value" v-show="!edit">{{
              infoTable.title_status
            }}</span>
            <el-select
              v-model="infoTable_reset.title_status"
              placeholder="请选择职称"
              v-show="edit"
            >
              <el-option
                v-for="item in titleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="政治情况">
            <span class="value" v-show="!edit">{{
              infoTable.political_status
            }}</span>
            <el-select
              v-model="infoTable_reset.political_status"
              placeholder="请选择政治情况"
              v-show="edit"
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
          <el-form-item label="组织">
            <span class="value" v-show="!edit">
              {{
                infoTable.school +
                " - " +
                infoTable.college +
                " - " +
                infoTable.class
              }}</span
            >
            <el-cascader
              v-show="edit"
              v-model="organizations"
              :options="organizationsOptions"
              :props="organizationsProps"
              style="width: 380px"
            >
            </el-cascader>
          </el-form-item>
        </el-form>

        <!-- 入党阶段 -->
        <el-divider content-position="left">入党阶段</el-divider>
        <el-timeline class="step-container">
          <el-timeline-item
            v-for="step in steps"
            :key="step.id"
            :timestamp="step.time"
            :color="step.status == 1 ? '#67c23a' : null"
            placement="top"
          >
            <!-- passed -->
            <el-card shadow="nerver" v-if="step.status == 1">
              <span class="step-title">{{ step.step_name }}</span>
              <span class="step-attribute"
                >状态：<span class="step-description-pass">已通过</span></span
              >
              <span class="step-attribute"
                >审核材料：<el-button type="text" @click="lookEvidence(step.id)"
                  >查看</el-button
                ></span
              >
            </el-card>
            <!-- now -->
            <el-card
              shadow="nerver"
              v-if="step.status == 2"
              id="nowStage"
              name="nowStage"
            >
              <span class="step-title">{{ step.step_name }}</span>
              <span class="step-attribute" style="padding: 10px 0"
                >状态：<span class="step-description-now">当前</span></span
              >
              <span class="step-attribute"
                >审核材料：<el-button type="text" @click="lookEvidence(step.id)"
                  >查看</el-button
                ></span
              >
              <span class="step-attribute">
                添加材料：
                <el-button type="text" @click="openUploadDialog(step.id)"
                  >添加</el-button
                >
              </span>
            </el-card>
            <!-- unreached -->
            <el-card shadow="nerver" v-if="step.status == 3">
              <span class="step-title">{{ step.step_name }}</span>
              <span class="step-attribute"
                >状态：
                <span class="step-description-unreach">未进入</span></span
              >
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>

      <!-- 查看材料dialog -->
      <el-dialog
        title="审核材料"
        :visible.sync="dialogVisible"
        width="50%"
        center
      >
        <div v-for="evidence in evidences" :key="evidence.id">
          <!-- file -->
          <span
            class="dialog-attribute"
            v-if="evidence.type == 1"
            @click="download(evidence)"
            style="cursor: pointer"
          >
            文件：{{ evidence.name }}
          </span>
          <!-- description -->
          <span class="dialog-attribute" v-if="evidence.type == 2">
            备注：<span class="dialog-description">{{
              evidence.description
            }}</span>
          </span>
          <span class="dialog-attribute" v-if="evidence.type == 3">
            <p v-if="applicationForm.title == '入党申请人信息登记表'">
              入党申请书：
            </p>
            <p v-else>谈话记录表：</p>
            <div style="padding: 10px 40px">
              <el-form id="printDiv">
                <div class="form">
                  <el-form-item>
                    <h3>{{ applicationForm.title }}</h3>
                  </el-form-item>
                  <div
                    class="el-item"
                    v-for="item in applicationForm.items"
                    :key="item.key"
                  >
                    <el-form-item
                      :prop="item.key"
                      v-if="item.type === 'varchar'"
                    >
                      <p>{{ item.title }}</p>
                      <p>{{ item.default }}</p>
                    </el-form-item>
                    <el-form-item :prop="item.key" v-if="item.type === 'text'">
                      <p>{{ item.title }}</p>
                      <p>{{ item.default }}</p>
                    </el-form-item>
                    <el-form-item
                      :prop="item.key"
                      v-if="item.type === 'integer'"
                    >
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
                    <el-form-item
                      :prop="item.key"
                      v-if="item.type === 'daytime'"
                    >
                      <p>{{ item.title }}</p>
                      <p>{{ item.default }}</p>
                    </el-form-item>
                    <el-form-item
                      :prop="item.key"
                      v-if="item.type === 'choice'"
                    >
                      <p>{{ item.title }}</p>
                      <p>{{ item.default }}</p>
                    </el-form-item>
                    <el-form-item :prop="item.key" v-if="item.type === 'image'">
                      <p>{{ item.title }}</p>
                      <div class="image">
                        <img :src="imageUrl" />
                      </div>
                    </el-form-item>
                    <el-form-item
                      :prop="item.key"
                      v-if="item.type === 'signature'"
                    >
                      <p>{{ item.title }}</p>
                      <div class="image">
                        <img :src="signUrl" />
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
          </span>
        </div>
        <div v-if="dialogTipVisible">
          <span class="dialog-tip">当前没有审核材料可以查看哦~</span>
        </div>
        <!-- ctrlbar -->
        <el-form
          v-if="sign_id"
          :label-position="'left'"
          label-width="100px"
          style="margin: 20px 20px 0 20px"
        >
          <el-form-item>理由(非必填)</el-form-item>
          <el-form-item>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入审批理由"
              v-model="reason"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-button" v-if="sign_id">
          <el-button type="primary" @click="signPass(sign_id)">通过</el-button>
          <el-button type="danger" @click="signReject(sign_id)">驳回</el-button>
        </div>
      </el-dialog>

      <!-- 上传材料dialog -->
      <el-dialog
        title="上传材料"
        :visible.sync="uploadDialogVisible"
        width="40%"
        center
      >
        <el-form
          :label-position="'left'"
          v-model="uploadForm"
          label-width="100px"
        >
          <el-form-item label="上传文件">
            <el-upload
              action="http://101.34.237.153:7000/v1/api/files"
              multiple
              :on-remove="fileupload_remove"
              :on-success="fileupload_success"
              :on-error="fileupload_error"
              :limit="1"
              :file-list="uploadForm.fileList"
              name="files"
              style="display: inline-block"
            >
              <el-button size="small">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="添加备注">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="uploadForm.text"
            >
            </el-input
          ></el-form-item>
          <span class="dialog-tip">二者选一上传，或者二者都上传即可。</span>
        </el-form>
        <el-button type="primary" class="dialog-button" @click="addEvidence"
          >确定</el-button
        >
      </el-dialog>

      <!-- 修改职务dialog -->
      <el-dialog
        title="修改职务"
        :visible.sync="groupDialogVisible"
        width="50%"
        center
      >
        <el-form :label-position="'left'" label-width="130px">
          <el-form-item label="当前所属用户组">
            <el-tag
              v-for="group in groupValue"
              :key="group.value"
              style="margin-left: 5px"
              >{{ group.label }}</el-tag
            >
            <span v-if="groupValue.length == 0">空</span>
          </el-form-item>
          <el-tabs :tab-position="'left'" style="margin-top: 20px">
            <el-tab-pane label="加入用户组">
              <span class="dialog-tip" v-if="groupData.length == 0"
                >已经加入所有用户组，无法再加入用户组啦~</span
              >
              <div v-if="groupData.length > 0">
                <el-select v-model="addedValue">
                  <el-option
                    v-for="group in groupData"
                    :key="group.value"
                    :label="group.label"
                    :value="group.value"
                  ></el-option>
                </el-select>
                <el-button
                  type="primary"
                  @click="addGroup"
                  style="margin-left: 10px"
                  >确定</el-button
                >
              </div>
            </el-tab-pane>
            <el-tab-pane label="移出用户组">
              <span class="dialog-tip" v-if="groupValue.length == 0"
                >当前所属用户组为空，无法再移出用户组啦~</span
              >
              <div v-if="groupValue.length > 0">
                <el-select v-model="movedValue">
                  <el-option
                    v-for="group in groupValue"
                    :key="group.value"
                    :label="group.label"
                    :value="group.value"
                  ></el-option>
                </el-select>
                <el-button
                  type="primary"
                  @click="removeGroup"
                  style="margin-left: 10px"
                  >确定</el-button
                >
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-dialog>

      <el-col :span="4" class="ctrl-container">
        <el-button
          type="primary"
          class="button"
          @click="edit = true"
          v-if="!edit"
          plain
          >编辑信息</el-button
        >
        <el-button
          type="primary"
          class="button"
          @click="confirmInfo"
          v-if="edit"
          plain
          >保存信息</el-button
        >
        <el-button type="warning" class="button" @click="openGroupDialog" plain
          >修改职务</el-button
        >
        <el-popconfirm
          title="确定要重置该用户密码？"
          @confirm="resetPsw"
          class="button"
        >
          <el-button type="danger" slot="reference" plain>重置密码</el-button>
        </el-popconfirm>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getUserInfo } from "@/api/partyMembership";
import { resetPsw } from "@/api/partyMembership";
import { getUserStep } from "@/api/partyMembership";
import { getEvidence } from "@/api/partyMembership";
import { signPass } from "@/api/partyMembership";
import { signReject } from "@/api/partyMembership";
import { uploadFile } from "@/api/partyMembership";
import { uploadDescription } from "@/api/partyMembership";
import { organizations } from "@/api/partyAffairs";
import { editInfo } from "@/api/partyMembership";
import { getGroupValue } from "@/api/partyMembership";
import { getGroupData } from "@/api/partyMembership";
import { addGroup } from "@/api/partyMembership";
import { removeGroup } from "@/api/partyMembership";
import { getFrom } from "@/api/application";

export default {
  data() {
    return {
      target_id: 0,
      infoTable: {},
      infoTable_reset: {},
      steps: [],
      user_id: "",
      dialogVisible: false, //查看材料
      dialogTipVisible: false,
      uploadDialogVisible: false, //上传材料
      groupDialogVisible: false, //修改职务
      evidences: [],
      applicationForm: {},
      sign_id: "",
      uploadForm: {
        fileList: [],
        text: "",
      },
      step_id: "",
      edit: false,
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
      educationOptions: [
        {
          value: 1,
          label: "本科在读",
        },
        {
          value: 2,
          label: "本科",
        },
        {
          value: 3,
          label: "硕士在读",
        },
        {
          value: 4,
          label: "硕士",
        },
        {
          value: 5,
          label: "博士在读",
        },
        {
          value: 6,
          label: "博士",
        },
      ],
      titleOptions: [
        {
          value: 1,
          label: "学生",
        },
        {
          value: 2,
          label: "讲师",
        },
        {
          value: 3,
          label: "副教授",
        },
        {
          value: 4,
          label: "教授",
        },
      ],
      organizations: [],
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
      groupValue: [], //当前所属用户组
      groupData: [], //所有用户组-当前所属用户组
      movedValue: "", //移入用户组
      addedValue: "", //加入用户组
      reason: "",
    };
  },
  created() {
    this.user_id = this.$route.query.id;
    this.getUserInfo();
    this.getUserStep();
  },
  mounted() {
    if (sessionStorage.getItem("isCheckUpgrade") === "true") {
      sessionStorage.removeItem("isCheckUpgrade");
      var _this = this;
      setTimeout(() => {
        document.getElementsByClassName(
          "app-container"
        )[0].scrollTop = document
          .getElementById("nowStage")
          .getBoundingClientRect().top;
        _this.lookEvidence(_this.target_id);
      }, 500);
    }
  },
  methods: {
    download(item) {
      var requestForm = document.createElement("form");
      var requestFrame = document.createElement("iframe");
      document.body.appendChild(requestForm);
      document.body.appendChild(requestFrame);
      requestFrame.id = "rfFrame";
      requestFrame.name = "rfFrame";
      requestFrame.style = "display:none;";
      requestForm.action = "http://" + item.url;
      requestForm.target = "rfFrame";
      requestForm.submit();
      this.$message.success({ showClose: true, message: "下载附件成功！" });
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
    handleReturn() {
      this.$router.go(-1);
    },
    getUserInfo() {
      var _this = this;
      getUserInfo(this.user_id)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.infoTable = _this.convertTable(res.data);
            _this.infoTable_reset = res.data;
            if (_this.infoTable_reset.sex == 0) {
              _this.infoTable_reset.sex = null;
            }
            _this.infoTable_reset.birthday =
              _this.infoTable_reset.birthday * 1000;
            _this.organizations = [];
            _this.organizations.push(res.data.school_id);
            _this.organizations.push(res.data.college_id);
            _this.organizations.push(res.data.class_id);
          }
        })
        .catch((err) => {
          _this.msgError("获取个人详细信息失败！");
        });
    },
    getUserStep() {
      var _this = this;
      getUserStep(this.user_id)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.steps = _this.convertStep(res.data);
          }
        })
        .catch((err) => {
          _this.msgError("获取入党阶段信息失败！");
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
      var politicalSet = {
        1: "群众",
        2: "团员",
        3: "入党申请人",
        4: "入党积极分子",
        5: "发展对象",
        6: "预备党员",
        7: "党员",
      };
      table.political_status = politicalSet[data.political_status];
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
      if (status) {
        return idSet[status];
      } else {
        return null;
      }
    },
    // convertIdentity(indentity) {
    //   var id_string = "";
    //   var id_result = [];
    //   var idSet = {
    //     0: "普通用户",
    //     1: "入党人",
    //     2: "预备党员",
    //     4: "党员",
    //     8: "支部书记",
    //     16: "积极分子",
    //     32: "发展对象",
    //   };
    //   for (var id in idSet) {
    //     if ((indentity & id) !== 0) {
    //       id_result.push(idSet[id]);
    //     }
    //   }
    //   id_string = id_result.length <= 0 ? "普通用户" : id_result.join("/");
    //   return id_string;
    // },
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
    resetPsw() {
      var _this = this;
      var data = [];
      data.push(this.user_id);
      resetPsw(data)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.msgSuccess("重置用户密码成功！");
          }
        })
        .catch((err) => {
          _this.msgError("重置用户密码失败!");
        });
    },
    convertStep(data) {
      var steps = [];
      data.forEach((element) => {
        var step = {};
        step.id = element.id;
        step.step_name = this.convertStepname(element.step_index);
        step.status = element.status;
        if (step.status === 2) {
          this.target_id = step.id;
        }
        step.time = this.convertTime(element.pass_at);
        steps.push(step);
      });
      return steps;
    },
    convertStepname(step_index) {
      var stepSet = {
        1: "递交入党申请书",
        2: "党组织派人谈话",
        3: "上报备案和公示",
        4: "推荐和确认入党积极分子",
        5: "上报备案和公示",
        6: "指定培养联系人",
        7: "培养、教育和考察",
        8: "推荐和确认发展对象",
        9: "上报备案和公示",
        10: "确定入党介绍人",
        11: "进行政治审查",
        12: "开展短期集中培训",
        13: "支部委员审查",
        14: "上报学院党委预审",
        15: "填写入党志愿书",
        16: "支部大会讨论",
        17: "学院党委派人谈话",
        18: "学院党委审批和报备",
        19: "入党宣誓",
        20: "培养、教育和考察",
        21: "递交转正申请",
        22: "群众座谈和上报公示",
        23: "支部审查",
        24: "上报学院党委预审",
        25: "支部大会讨论",
        26: "学院党委审批和报备",
        27: "材料归档",
      };
      return stepSet[step_index];
    },
    convertTime(timestamp) {
      if (timestamp) {
        var time = new Date(timestamp * 1000);
        return (
          time.toLocaleDateString().replace(/\//g, "-") +
          " " +
          time.toTimeString().substr(0, 5)
        );
      } else {
        return null;
      }
    },
    lookEvidence(step_id) {
      var _this = this;
      this.dialogTipVisible = false;
      this.reason = "";
      getEvidence(step_id)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.sign_id = res.data.sign_id;
            _this.evidences = _this.convertEvidence(res.data.evidence_data);
            if (_this.evidences.length <= 0) {
              _this.dialogTipVisible = true;
            }
            _this.dialogVisible = true;
          }
        })
        .catch((err) => {
          _this.msgError("查看上传材料失败！");
        });
    },
    convertEvidence(data) {
      var evidences = [];
      data.forEach((element) => {
        var item = {};
        item.name = element.name;
        item.id = element.id;
        item.type = element.ref_obj_type;
        item.url = element.url;
        item.description = element.description;
        item.ref_obj_id = element.ref_obj_id;
        if (element.ref_obj_type === 3) {
          getFrom({ form_id: element.ref_obj_id }).then((res) => {
            if (res !== false) {
              res.data.items.forEach((item) => {
                if (item.type === "image") {
                  this.imageUrl =
                    "http://101.34.237.153:7000/fastapi/v1/api/files/" +
                    item.default;
                }
                if (item.type === "signature") {
                  this.signUrl =
                    "http://101.34.237.153:7000/fastapi/v1/api/files/" +
                    item.default;
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
              console.log(123);
              this.applicationForm = res.data;
            }
          });
        }
        evidences.push(item);
      });
      return evidences;
    },
    signPass(sign_id) {
      var _this = this;
      signPass(sign_id, this.reason)
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
      signReject(sign_id, this.reason)
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
    fileupload_success(response, file, fileList) {
      this.uploadForm.fileList.push({
        name: file.name,
        url: `${response[0].file_address}`,
      });
    },
    fileupload_error(err, file, fileList) {
      this.msgError("上传文件失败！");
    },
    fileupload_remove(file, fileList) {
      let url = `${file.url}`;
      for (let i = 0; i < this.uploadForm.fileList.length; i++) {
        if (this.uploadForm.fileList[i].url == url) {
          this.uploadForm.fileList.splice(i, 1);
        }
      }
      this.msgSuccess("移除文件成功！");
    },
    openUploadDialog(step_id) {
      this.uploadDialogVisible = true;
      this.step_id = step_id;
    },
    addEvidence() {
      if (this.uploadForm.fileList.length > 0) {
        var data = {};
        data.step_id = this.step_id;
        data.file_name = this.uploadForm.fileList[0].url;
        uploadFile(this.step_id, this.uploadForm.fileList[0].url)
          .then((res) => {
            if (res !== false && res.code == 200) {
              this.msgSuccess("上传文件成功！");
              this.uploadDialogVisible = false;
              this.getUserStep(this.user_id);
            }
          })
          .catch((err) => {
            this.msgError("上传文件失败！");
          });
      }
      if (this.uploadForm.text) {
        var data = {};
        data.step_id = this.step_id;
        data.description = this.uploadForm.text;
        uploadDescription(this.step_id, {
          description: this.uploadForm.text,
        })
          .then((res) => {
            if (res !== false && res.code == 200) {
              this.msgSuccess("上传备注成功！");
              this.uploadDialogVisible = false;
              this.getUserStep(this.user_id);
            }
          })
          .catch((err) => {
            this.msgError("上传备注失败！");
          });
      }
    },
    confirmInfo() {
      var _this = this;
      var data = {};
      data = this.getRstTable();
      editInfo(this.user_id, data)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.msgSuccess("修改信息成功！");
            _this.edit = false;
            _this.getUserInfo(this.user_id);
          }
        })
        .catch((err) => {
          _this.msgError("修改信息失败！");
        });
    },
    getRstTable() {
      var data = {};
      const {
        address,
        sex,
        phone,
        IDCard,
        nation,
        birthday,
        hometown,
        major,
        email,
        name,
        student_id,
        political_status,
        education_status,
        title_status,
      } = this.infoTable_reset;
      data.address = address;
      data.sex = sex ? sex : 0;
      data.phone = phone;
      data.IDCard = IDCard;
      data.nation = nation;
      data.birthday = birthday / 1000;
      data.hometown = hometown;
      data.major = major;
      data.email = email;
      data.name = name;
      data.school_id = this.organizations[0];
      data.college_id = this.organizations[1];
      data.class_id = this.organizations[2];
      data.student_id = student_id;
      data.political_status = political_status;
      data.education_status = education_status;
      data.title_status = title_status;
      return data;
    },
    openGroupDialog() {
      this.groupDialogVisible = true;
      this.getGroupValue();
      this.getGroupData();
    },
    getGroupValue() {
      var _this = this;
      _this.groupValue = [];
      getGroupValue({ user_id: this.user_id })
        .then((res) => {
          if (res !== false && res.code == 200) {
            if (res.data.length > 0) {
              res.data.forEach((element) => {
                _this.groupValue.push({
                  value: element.id,
                  label: element.name,
                });
              });
            }
          }
        })
        .catch((err) => {
          _this.msgError("获取用户组失败！");
        });
    },
    getGroupData() {
      var _this = this;
      _this.groupData = [];
      getGroupData()
        .then((res) => {
          if (res !== false && res.code == 200) {
            if (res.data.length > 0) {
              res.data.forEach((element) => {
                if (_this.groupValue.length == 0) {
                  _this.groupData.push({
                    value: element.id,
                    label: element.name,
                  });
                } else {
                  for (let i = 0; i < _this.groupValue.length; i++) {
                    if (_this.groupValue[i].value !== element.id) {
                      _this.groupData.push({
                        value: element.id,
                        label: element.name,
                      });
                    }
                  }
                }
              });
            }
          }
        })
        .catch((err) => {
          _this.msgError("获取用户组失败！");
        });
    },
    removeGroup() {
      var _this = this;
      var data = [];
      data.push(this.user_id);
      removeGroup(this.movedValue, data)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.msgSuccess("移出用户组成功!");
            _this.getGroupValue();
            _this.getGroupData();
          }
        })
        .catch((err) => {
          _this.msgError("移出用户组失败！");
        });
    },
    addGroup() {
      var _this = this;
      var data = [];
      data.push(this.user_id);
      addGroup(this.addedValue, data)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.msgSuccess("加入用户组成功!");
            _this.getGroupValue();
            _this.getGroupData();
          }
        })
        .catch((err) => {
          _this.msgError("加入用户组失败！");
        });
    },
  },
};
</script>


<style lang="scss" scoped>
::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
.container {
  padding: 0px !important;
  .info-container {
    padding: 0 20px 0 0;
    border-right: 1px solid #ebeef5;

    .value {
      color: #c0c4cc;
      font-weight: 400;
    }

    .step-container {
      padding: 20px;

      .step-title {
        display: block;
        margin-bottom: 10px;
        font-weight: 600;
        font-size: 15px;
      }

      .step-attribute {
        display: block;
      }

      .step-description-pass {
        color: #67c23a;
      }

      .step-description-now {
        color: #f56c6c;
      }

      .step-description-unreach {
        color: #c0c4cc;
      }
    }
  }

  .dialog-attribute {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 15px;
  }

  .dialog-description {
    font-weight: normal;
    font-size: 14px;
    color: #c0c4cc;
  }

  .dialog-button {
    display: table;
    margin: 0 auto;
    margin-top: 20px;
  }

  .dialog-tip {
    display: table;
    margin: 0 auto;
    color: #c0c4cc;
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
      margin-left: 0px;
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
</style>

<style>
.el-divider__text,
.el-link {
  font-size: 16px;
  font-weight: 600;
}
.el-form-item__label {
  font-size: 15px;
  font-weight: 400;
}
.el-form-item {
  margin-bottom: 10px !important;
}
</style>