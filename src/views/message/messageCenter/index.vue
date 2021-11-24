<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-row class="title-box">
        <el-col :span="8">
          <el-input
            placeholder="请输入关键字..."
            prefix-icon="el-icon-search"
            size="small"
            v-model="search_keyword"
            class="searchBox"
          >
          </el-input>
          <el-button
            size="small"
            style="margin-left: 10px"
            @click="getnoticesClick()"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="8">
          <span class="title">当前消息</span>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>

      <el-form class="message-box">
        <el-divider></el-divider>
        <el-card
          shadow="hover"
          class="message"
          v-for="message in messages"
          :key="message.id"
          @click.native="handleInfo(message.id)"
        >
          <el-row :gutter="20">
            <el-col :span="1">
              <el-badge value="未读" v-if="message.is_read == 0"> </el-badge>
              <div
                style="width: 38px; display: inline-block"
                v-if="message.is_read == 1"
              ></div>
            </el-col>
            <el-col :span="4">
              <span class="message-title">{{ message.title }}</span>
            </el-col>
            <el-col :span="16">
              <span class="message-content">{{ message.overview }}</span>
            </el-col>
            <el-col :span="3">
              <span class="message-else">{{ message.time }}</span>
            </el-col>
          </el-row>
        </el-card>
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
      </el-form>
    </el-card>

    <el-dialog
      @close="closeDialog"
      :title="info.title"
      :visible.sync="infoVisible"
      width="50%"
      center
    >
      <el-form v-model="info" label-width="100px" label-position="'left'">
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
      </el-form>
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
  </div>
</template>

<script>
import { getnotices } from "@/api/messageCenter";
import { getMsgDetail } from "@/api/messageCenter";
import { searchUser } from "@/api/messageCenter";
import { passAsk } from "@/api/messageCenter";
import { rejectAsk } from "@/api/messageCenter";

export default {
  data() {
    return {
      isUpgrade: false,
      currentPage: 1,
      total: 0,
      search_keyword: "",
      messages: [],
      page_id: 1,
      info: {},
      infoVisible: false,
      footerVisible: false,
      passButton: false,
      rejectButton: false,
    };
  },
  created() {
    this.getnotices();
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
      requestForm.action = item.file;
      requestForm.target = "rfFrame";
      requestForm.submit();
      this.$message.success({ showClose: true, message: "下载附件成功！" });
    },
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
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getnotices();
    },
    closeDialog() {
      this.getnotices();
      this.isUpgrade = false;
    },
    getnoticesClick() {
      this.currentPage = 1;
      this.getnotices();
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
    getnotices() {
      var _this = this;
      getnotices({
        page_size: 20,
        page_id: this.currentPage,
        keyword: this.search_keyword,
      })
        .then((res) => {
          if (res !== false) {
            if (res.data.length > 0) {
              _this.total = res.count;
              _this.messages = _this.convertMessages(res.data);
            } else {
              _this.msgError("未获取到消息！");
            }
          }
        })
        .catch((err) => {
          _this.msgError("获取消息列表失败！");
        });
    },
    convertMessages(data) {
      var _this = this;
      var list = [];
      data.forEach((element) => {
        var item = {};
        item.id = element.id;
        item.title = element.title;
        item.overview = element.overview;
        item.time = _this.convertTime(element.create_at);
        item.is_read = element.is_read;
        list.push(item);
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
    handleInfo(id) {
      var _this = this;
      getMsgDetail(id)
        .then((res) => {
          if (res !== false) {
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
.el-dialog--center .el-dialog__body {
  padding: 25px;
}
.el-dialog__footer {
  padding: 0 20px 20px 20px;
}
</style>

<style lang="scss" scoped>
.paginationDiv {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
}
.title-box {
  padding: 10px 20px;

  .searchBox {
    width: 50%;
    float: left;
  }

  .title {
    display: table;
    margin: 0 auto;
  }
}

.message-box {
  padding: 0 20px;

  .message {
    margin-top: 20px;
    height: 110px;

    .message-title {
      font-weight: bold;
      font-size: 16px;
    }

    .message-content {
      color: #c0c4cc;
      font-size: 14px;
      font-weight: normal;
      word-wrap: break-word;
      word-break: normal;
    }

    .message-else {
      color: #c0c4cc;
      font-size: 14px;
    }
  }
}

.info-content {
  color: #c0c4cc;
}

.footer {
  color: #c0c4cc;
  font-size: 13px;
  display: table;
  margin: 0 auto;
  padding: 40px 0 20px 0;
}
</style>
