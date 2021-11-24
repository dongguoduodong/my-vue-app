<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-row
        class="notice-container"
        :gutter="40"
        style="display: table; margin: 0 auto"
      >
        <el-col :span="12">
          <span class="title">
            <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i>
            最近消息</span
          >
          <el-card
            class="message-box"
            shadow="hover"
            v-for="notice in notices"
            :key="notice.id"
            @click.native="handleMesInfo(notice.id)"
          >
            <span class="message-title">{{ notice.title }}</span>
            <span class="message-content" style="margin-top: 10px">{{
              notice.overview
            }}</span>
          </el-card>
        </el-col>

        <el-col :span="12">
          <span class="title">
            <i class="el-icon-bell" style="margin-right: 10px"></i
            >消息反馈</span
          >
          <el-card
            class="message-box"
            shadow="hover"
            v-for="feedback in feedbacks"
            :key="feedback.id"
          >
            <span class="message-title">{{ feedback.name }}</span>
            <el-row style="margin-top: 10px">
              <el-col :span="12">
                <span class="message-content"
                  >通知 {{ feedback.count }} 人</span
                >
                <span class="message-content" v-if="feedback.type == 2"
                  >请假 {{ feedback.is_ask_off }} 人</span
                >
                <span class="message-content" v-if="feedback.type == 3"
                  >报名 {{ feedback.is_sign_up }} 人</span
                >
              </el-col>
              <el-col :span="12">
                <span class="message-content"
                  >已读 {{ feedback.is_read }} 人</span
                >
                <span class="message-content"
                  >未读 {{ feedback.count - feedback.is_read }} 人</span
                >
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-form
      v-model="info"
      label-width="100px"
      label-position="'left'"
      class=""
    >
      <el-dialog
        @close="closeDialog"
        :title="info.title"
        :visible.sync="infoVisible"
        width="50%"
        center
      >
        <el-form-item label="来自">
          <span class="info-content">{{ info.from_user_name }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span class="info-content">{{ info.time }}</span>
        </el-form-item>
        <el-form-item label="主要内容">
          <span class="info-content">{{ info.text }}</span>
        </el-form-item>
        <el-form-item label="附件" v-if="info.file">
          <span style="cursor: pointer" @click="download(info)">点击下载</span>
        </el-form-item>
        <div
          style="display: flex; flex-direction: row; justify-content: center"
          v-if="this.isUpgrade"
        >
          <el-button type="primary" @click="gotoCheck">去审批</el-button>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="passAskoff" v-if="passButton"
            >通 过</el-button
          >
          <el-button type="danger" @click="rejectAskoff" v-if="rejectButton"
            >驳 回</el-button
          >
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getMsgDetail } from "@/api/messageCenter";
import { getnotices } from "@/api/home";
import { getfeedbacks } from "@/api/home";
import { searchUser } from "@/api/messageCenter";
import { passAsk } from "@/api/messageCenter";
import { rejectAsk } from "@/api/messageCenter";

export default {
  name: "Home",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      notices: [],
      feedbacks: [],
      info: {},
      infoVisible: false,
      passButton: false,
      rejectButton: false,
      isUpgrade: false,
    };
  },
  created() {
    this.getnotices();
    this.getfeedbacks();
  },
  methods: {
    gotoCheck() {
      let url =
        window.location.href.split("#")[0] +
        "#" +
        "/info/partyMembership/details?id=" +
        this.info.id;
      sessionStorage.setItem("isCheckUpgrade", "true");
      window.open(url);
      location.reload();
    },
    download(item) {
      var requestForm = document.createElement("form");
      var requestFrame = document.createElement("iframe");
      document.body.appendChild(requestForm);
      document.body.appendChild(requestFrame);
      requestFrame.id = "rfFrame";
      requestFrame.name = "rfFrame";
      requestFrame.style = "display:none;";
      requestForm.action = item.file;
      requestForm.target = "rfFrame";
      requestForm.submit();
      this.$message.success({ showClose: true, message: "下载附件成功！" });
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
    msgWarning(msg) {
      this.$message.warning(msg)
    },
    closeDialog() {
      this.getnotices();
      this.isUpgrade = false;
    },
    convertTime(timestamp) {
      var time = new Date(timestamp * 1000);
      return (
        time.toLocaleDateString().replace(/\//g, "-") +
        " " +
        time.toTimeString().substr(0, 5)
      );
    },
    convertInfo(data) {
      var detail = {};
      detail.title = data.title;

      detail.from_user_name = "UNDEFINED";
      searchUser(data.from_user_id).then((res) => {
        if (res !== false && res.code == 200) {
          detail.from_user_name = res.data.name;
        }
      });

      detail.time = this.convertTime(data.create_at);
      detail.text = data.content;

      data.operations.forEach((element) => {
        if (element.type == 3) {
          detail.file = "http://" + element.url;
        }
        if (element.type == 5) {
          this.passButton = true;
          detail.passUrl = "http://" + element.url;
        }
        if (element.type == 6) {
          this.rejectButton = true;
          detail.rejectUrl = "http://" + element.url;
        }
      });
      return detail;
    },
    handleMesInfo(id) {
      var _this = this;
      getMsgDetail(id)
        .then((res) => {
          if (res !== false && res.code == 200) {
            if (res.data.operations.length > 0) {
              if (res.data.operations[0].type === 4) {
                this.isUpgrade = true;
              }
            }
            if (res.data) {
              _this.passButton = false;
              _this.rejectButton = false;
              _this.info = _this.convertInfo(res.data);
              _this.info.id = res.data.from_user_id;
              _this.infoVisible = true;
            } else {
              _this.msgError("未获取到消息详情！");
            }
          }
        })
        .catch((err) => {
          _this.msgError("获取消息详情失败！");
        });
    },
    passAskoff() {
      var _this = this;
      passAsk(this.info.passUrl)
        .then((res) => {
          if (res !== false && res.code == 1014) {
            _this.msgSuccess("通过请假申请成功！");
            _this.infoVisible = false;
            _this.getnotices();
          }
        })
        .catch((err) => {
          _this.msgError("通过请假申请失败！");
        });
    },
    rejectAskoff() {
      var _this = this;
      rejectAsk(this.info.rejectUrl)
        .then((res) => {
          if (res !== false && res.code == 1014) {
            _this.msgSuccess("驳回请假申请成功！");
            _this.infoVisible = false;
            _this.getnotices();
          }
        })
        .catch((err) => {
          _this.msgError("驳回请假申请失败！");
        });
    },
    getnotices() {
      var _this = this;
      getnotices({ page_size: 5 })
        .then((res) => {
          if (res !== false && res.code == 200) {
            if (res.data.length > 0) {
              _this.notices = res.data;
            } else {
              // _this.msgError("未获取到最近消息！");
              _this.msgWarning('暂无新消息')
            }
          }
        })
        .catch((err) => {
          _this.msgError("获取最近消息列表失败！");
        });
    },
    getfeedbacks() {
      var _this = this;
      getfeedbacks({ page_size: 5 })
        .then((res) => {
          if (res !== false && res.code == 200) {
            if (res.data.length > 0) {
              _this.feedbacks = res.data;
            } else {
              // _this.msgError("未获取到消息反馈！");
              _this.msgWarning("暂无新消息");
            }
          }
        })
        .catch((err) => {
          _this.msgError("获取消息反馈列表失败！");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .notice-container {
    display: table;
    margin: 0 auto;

    .title {
      font-size: 25px;
      font-weight: bold;
      color: #303133;
      margin: 0;
      display: inline-block;
      border-bottom: 2px solid #3a62d7;
      padding-bottom: 5px;
    }

    .message-box {
      margin: 20px 0;

      .message-title {
        display: block;
        font-weight: bold;
        font-size: 20px;
      }

      .message-content {
        display: block;
        margin: 0;
        font-size: 13px;
        line-height: 26px;
        color: #c0c4cc;
      }
    }
  }
}
</style>

<style>
.el-card__body {
  padding: 30px !important;
}
</style>