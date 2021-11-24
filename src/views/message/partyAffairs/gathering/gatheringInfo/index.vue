<template>
  <div class="app-contianer">
    <div v-if="$route.meta.showDetail">
      <el-row>
        <el-col :span="1">
          <i
            class="el-icon-back"
            style="padding: 16px 0; cursor: pointer"
            @click="handleReturn"
          ></i>
        </el-col>

        <el-col :span="22">
          <div class="info-container">
            <el-divider content-position="left">集会详情</el-divider>
            <el-form
              v-model="gatheringInfo"
              :label-position="'left'"
              label-width="100px"
            >
              <el-form-item label="集会名称">
                <span class="value">{{ gatheringInfo.name }}</span>
              </el-form-item>
              <el-form-item label="集会类型">
                <span class="value">{{ gatheringInfo.type }}</span>
              </el-form-item>
              <el-form-item label="集会时间">
                <span class="value"
                  >{{ gatheringInfo.start_time }} ~
                  {{ gatheringInfo.end_time }}</span
                >
              </el-form-item>
              <el-form-item label="集会地点">
                <span class="value">{{
                  gatheringInfo.address
                }}</span></el-form-item
              >
              <el-form-item label="主要内容">
                <span class="value">{{
                  gatheringInfo.content
                }}</span></el-form-item
              >
              <el-form-item label="附件">
                <span v-show="!gatheringInfo.file" class="value">暂无附件</span>
                <span
                  v-show="gatheringInfo.file"
                  style="cursor: pointer"
                  @click="download(gatheringInfo)"
                  >点击下载</span
                >
              </el-form-item>
            </el-form>

            <el-divider content-position="left">参与详情</el-divider>
            <el-form
              v-model="feedbackInfo"
              :label-position="'left'"
              label-width="100px"
            >
              <el-form-item label="总人数">
                <span class="value">{{ feedbackInfo.count }}</span>
              </el-form-item>
              <el-form-item label="已读人数">
                <span class="value">{{ feedbackInfo.is_read }}</span>
              </el-form-item>
              <el-form-item label="未读人数">
                <span class="value">{{
                  feedbackInfo.count - feedbackInfo.is_read
                }}</span>
              </el-form-item>
              <el-form-item label="请假人数" v-if="feedbackInfo.type == 2">
                <span class="value">{{ feedbackInfo.is_ask_off }}</span>
              </el-form-item>
              <el-form-item label="报名人数" v-if="feedbackInfo.type == 3">
                <span class="value">{{ feedbackInfo.is_sign_up }}</span>
              </el-form-item>
              <el-form-item label="查看筛选">
                <el-select
                  v-model="meetingValue"
                  v-if="feedbackInfo.type == 2"
                  placeholder="请选择状态"
                >
                  <el-option
                    v-for="status in meetingStatus"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="activityValue"
                  v-if="feedbackInfo.type == 3"
                  placeholder="请选择状态"
                >
                  <el-option
                    v-for="status in activityStatus"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  ></el-option>
                </el-select>
                <el-button
                  type="primary"
                  @click="searchUser"
                  style="margin-left: 10px"
                  >确定</el-button
                >
              </el-form-item>
            </el-form>
            <el-table
              :data="userTable"
              element-loading-text="加载中"
              v-loading="userTableLoading"
              v-if="userTableShow"
              style="width: 30%"
            >
              <el-table-column prop="username" label="姓名"> </el-table-column>
            </el-table>
            <div class="paginationDiv" v-if="userTableShow">
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getFeedback } from "@/api/partyAffairs";
import { searchFeedbackUser } from "@/api/partyAffairs";

export default {
  data() {
    return {
      currentPage: 1,
      total: 0,
      gatheringInfo_raw: {},
      gatheringInfo: {},
      feedbackInfo: {},
      meetingValue: "",
      meetingStatus: [
        {
          value: 1,
          label: "未读",
        },
        {
          value: 2,
          label: "已读",
        },
        {
          value: 3,
          label: "请假",
        },
      ],
      activityValue: "",
      activityStatus: [
        {
          value: 1,
          label: "未读",
        },
        {
          value: 2,
          label: "已读",
        },
        {
          value: 4,
          label: "报名",
        },
      ],
      userTable: [],
      userTableLoading: false,
      userTableShow: false,
    };
  },
  created() {
    this.gatheringInfo_raw = JSON.parse(
      window.sessionStorage.getItem("gatheringInfo")
    );
    this.getGatheringInfo();
    this.getFeedback();
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
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.searchUser();
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
    handleReturn() {
      this.$router.go(-1);
    },
    getGatheringInfo() {
      var _this = this;
      this.gatheringInfo.name = this.gatheringInfo_raw.name;
      var typeSet = {
        1: "会议",
        2: "活动",
      };
      this.gatheringInfo.type = typeSet[this.gatheringInfo_raw.type];
      this.gatheringInfo.address = this.gatheringInfo_raw.address;
      this.gatheringInfo.start_time = this.convertTime(
        this.gatheringInfo_raw.start_time
      );
      this.gatheringInfo.end_time = this.convertTime(
        this.gatheringInfo_raw.end_time
      );
      this.gatheringInfo.content = this.gatheringInfo_raw.content;
      if (_this.gatheringInfo_raw.url) {
        _this.gatheringInfo.file = "http://" + _this.gatheringInfo_raw.url;
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
    getFeedback() {
      var _this = this;
      var type = this.gatheringInfo_raw.type + 1;
      var id = this.gatheringInfo_raw.id;
      getFeedback(type, id)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.feedbackInfo = res.data;
          }
        })
        .catch((err) => {
          _this.msgError("获取反馈情况失败！");
        });
    },
    searchUser() {
      var _this = this;
      var gid = this.gatheringInfo_raw.id;
      var data = {};
      data.page_id = this.currentPage;
      data.page_size = 20;
      data.status =
        this.feedbackInfo.type == 2 ? this.meetingValue : this.activityValue;

      this.userTable = [];
      this.userTableShow = true;
      this.userTableLoading = true;

      searchFeedbackUser(gid, data)
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.total = res.count;
            _this.userTable = res.data;
            _this.userTableLoading = false;
          }
        })
        .catch((err) => {
          _this.msgError("筛选状态人员失败！");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.paginationDiv {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
}
.value {
  color: #c0c4cc;
  font-weight: 400;
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