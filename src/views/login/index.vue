<template>
  <div class="login-container">
    <el-card class="card-box" shadow="always">
      <el-row>
        <!-- left -->
        <el-col :span="10">
          <div class="pic"></div>
        </el-col>
        <!-- right -->
        <el-col :span="14">
          <el-form
            ref="loginForm"
            v-model="loginForm"
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <span class="title">欢迎登录</span>
            <div class="input-box">
              <el-form-item prop="schoolid">
                <i class="el-icon-school"></i>
                <el-select
                  ref="schoolid"
                  v-model="loginForm.school_id"
                  size="mini"
                  placeholder="请选择学校"
                  name="schoolid"
                  class="username"
                >
                  <el-option
                    v-for="school in schools"
                    :key="school.value"
                    :label="school.label"
                    :value="school.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="studentid">
                <i class="el-icon-user"></i>
                <el-input
                  ref="studentid"
                  v-model="loginForm.student_id"
                  size="mini"
                  placeholder="请输入学号"
                  name="studentid"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                  class="username"
                />
              </el-form-item>
              <el-form-item prop="password">
                <i class="el-icon-lock"></i>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  size="mini"
                  :type="passwordType"
                  placeholder="请输入密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                  class="password"
                />
              </el-form-item>
              <el-checkbox v-model="checked" class="check" style="width: 230px"
                >记住密码</el-checkbox
              >
              <el-button
                :loading="loading"
                type="primary"
                size="normal"
                class="login-button"
                @click.native.prevent="handleLogin"
                >登录</el-button
              >
              <el-link type="primary">忘记密码</el-link>
            </div>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <span class="copyright">Copyright © 2020 有限公司</span>
  </div>
</template>

<script>
// import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        school_id: 1,
        student_id: "17081210",
        password: "123123",
      },
      schools: [
        {
          value: 1,
          label: "杭州电子科技大学",
        },
      ],
      loading: false,
      passwordType: "password",
      redirect: undefined,
      checked: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    handleLogin() {
      var data = this.loginForm;
      this.loading = true;
      this.$store
        .dispatch("user/login", data)
        .then((res) => {
          if (res !== false) {
            this.$router.push({ path: this.redirect || "/" });
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error("登录失败！");
        });
      this.loading = false;
    },
  },
};
</script>


<style lang="scss">
$dark_blue: #3a62d7;

.el-icon-school,
.el-icon-user,
.el-icon-lock {
  border-right: 2px solid $dark_blue;
  padding-right: 10px;
}

.el-card {
  border: 0px;
  background-color: transparent;
}

.el-card__body {
  padding: 0px;
}
</style>


<style lang="scss" scoped>
$dark_gray: #889aa4;
$dark_blue: #3a62d7;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #5881d4;
  overflow: hidden;
  position: relative;

  .card-box {
    width: 700px;
    height: 400px;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .pic {
      background-color: #2758d6;
      opacity: 0.65;
      min-height: 400px;
    }

    .login-form {
      background-color: white;
      text-align: center;
      height: 400px;
      padding: 20px;

      .title {
        display: inline-block;
        margin-top: 30px;
        font-size: 18px;
        font-weight: bold;
        border-bottom: 2px solid $dark_blue;
        padding-bottom: 5px;
      }

      .input-box {
        padding: 20px 30px 20px 30px;

        .el-form-item {
          margin-bottom: 10px;
        }

        .username {
          width: 200px;
          margin-left: 5px;
        }

        .password {
          width: 200px;
          margin-left: 5px;
        }

        .login-button {
          width: 230px;
          background: $dark_blue;
          margin: 20px;
        }
      }
    }
  }

  .copyright {
    color: white;
    font-size: 12px;
    bottom: 10%;
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
}
</style>
