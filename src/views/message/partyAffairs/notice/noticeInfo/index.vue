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
            <el-divider content-position="left">通知详情</el-divider>
            <el-form
              v-model="noticeInfo"
              :label-position="'left'"
              label-width="100px"
            >
              <el-form-item label="通知名称">
                <span class="value">{{ noticeInfo.name }}</span>
              </el-form-item>
              <el-form-item label="通知类型">
                <span class="value">{{ noticeInfo.type }}</span>
              </el-form-item>
            </el-form>

            <el-divider content-position="left">反馈详情</el-divider>
            <el-form
              v-model="feedbackInfo"
              :label-position="'left'"
              label-width="100px"
              v-if="feedbackInfo.type !== 1"
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
              <el-form-item label="请假人数" v-if="noticeInfo_raw.type == 2">
                <span class="value">{{ feedbackInfo.is_ask_off }}</span>
              </el-form-item>
              <el-form-item label="报名人数" v-if="noticeInfo_raw.type == 3">
                <span class="value">{{ feedbackInfo.is_sign_up }}</span>
              </el-form-item>
              <el-form-item label="具体情况">
                <el-table
                  :data="feedbackTable"
                  element-loading-text="加载中"
                  v-loading="feedbackTableLoading"
                  border
                >
                  <el-table-column prop="name" label="姓名"> </el-table-column>
                  <el-table-column prop="is_read" label="是否已读">
                  </el-table-column>
                  <el-table-column
                    prop="is_ask_off"
                    label="是否已请假"
                    v-if="noticeInfo_raw.type == 2"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="is_sign_up"
                    label="是否已报名"
                    v-if="noticeInfo_raw.type == 3"
                  >
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
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getFeedbackUser } from "@/api/notice";

export default {
  data() {
    return {
      currentPage: 1,
      total: 0,
      noticeInfo_raw: {},
      noticeInfo: {},
      feedbackInfo: {},
      feedbackTable: [],
      feedbackTableLoading: false,
    };
  },
  created() {
    this.noticeInfo_raw = JSON.parse(
      window.sessionStorage.getItem("noticeInfo")
    );
    this.getnoticeInfo();
    this.getFeedback();
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getFeedback();
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
    getnoticeInfo() {
      this.noticeInfo.name = this.noticeInfo_raw.name;
      var typeSet = {
        1: "普通通知",
        2: "会议通知",
        3: "活动通知",
      };
      this.noticeInfo.type = typeSet[this.noticeInfo_raw.type];
    },
    getFeedback() {
      this.feedbackInfo.count = this.noticeInfo_raw.count;
      this.feedbackInfo.id = this.noticeInfo_raw.id;
      this.feedbackInfo.is_ask_off = this.noticeInfo_raw.is_ask_off;
      this.feedbackInfo.is_read = this.noticeInfo_raw.is_read;
      this.feedbackInfo.is_sign_up = this.noticeInfo_raw.is_sign_up;
      this.feedbackInfo.ref_obj_id = this.noticeInfo_raw.ref_obj_id;
      this.getFeedbackTable();
    },
    getFeedbackTable() {
      var _this = this;
      this.feedbackTableLoading = true;
      getFeedbackUser({
        feedback_id: this.feedbackInfo.id,
        page_id: this.currentPage,
        page_size: 20,
      })
        .then((res) => {
          if (res !== false && res.code == 200) {
            _this.total = res.count;
            _this.feedbackTable = _this.convertFeedbackTable(res.data);
            _this.feedbackTableLoading = false;
          }
        })
        .catch((err) => {
          _this.msgError("获取反馈人员情况列表失败！");
        });
    },
    convertFeedbackTable(data) {
      var list = [];
      data.forEach((element) => {
        var item = {};
        item.user_id = element.user_id;
        item.name = element.name;
        var YNSet = {
          false: "否",
          true: "是",
        };
        item.is_read = YNSet[element.is_read];
        item.is_sign_up = YNSet[element.is_sign_up];
        item.is_ask_off = YNSet[element.is_ask_off];
        list.push(item);
      });
      return list;
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