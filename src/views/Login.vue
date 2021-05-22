<template>
    <div class="login-wrap">
        <div class="ms-login" v-show="isLogin">
            <div class="ms-title">党员信息管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" >
                <el-form-item prop="userName">
                    <el-input v-model="param.userName" placeholder="userName">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                        <!-- <el-button icon="el-icon-user"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                    >
                        <!-- 可以去看看vue的插槽，就能明白这里的template #prepend的意思 -->
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <div style="overflow:hidden;">
                    <span class="login-tips">Tips : 用户名和密码随便填。</span>
                    <span class="login-tipsPs" @click="isLogin = false">修改密码?</span>
                </div>
            </el-form>
        </div>

        <div class="chPassword" v-show="!isLogin">
            <div class="ms-title">修改密码</div>
            <el-form :model="nPassword" :rules="paRules" ref="cPassword" label-width="0px" class="ms-content" >
                <el-form-item prop="userName">
                    <el-input v-model="nPassword.userName" placeholder="用户名">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                        <!-- <el-button icon="el-icon-user"></el-button> -->
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="老密码"
                        v-model="nPassword.password"
                    >
                        <!-- 可以去看看vue的插槽，就能明白这里的template #prepend的意思 -->
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="nPassword">
                    <el-input
                        type="password"
                        placeholder="新密码"
                        v-model="nPassword.nPassword"
                    >
                        <!-- 可以去看看vue的插槽，就能明白这里的template #prepend的意思 -->
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="confirmNPassword">
                    <el-input
                        type="password"
                        placeholder="再次输入新密码"
                        v-model="nPassword.confirmNPassword"
                    >
                        <!-- 可以去看看vue的插槽，就能明白这里的template #prepend的意思 -->
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>

                <div class="login-btn">
                    <el-button type="primary" @click="changePassword()">确定</el-button>
                </div>
                <div style="overflow:hidden;">
                    <span class="login-tips">Tips : 用户名和密码随便填。</span>
                    <span class="login-tipsPs" @click="isLogin=true">返回登录</span>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import {getStartDataFromBackend} from '../api/index.js'
export default {
    data() {
        return {
            isLogin:true,
            param: {
                userName: "00008612",
                password: "123456"
            },
            rules: {
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ]
            },

            nPassword:{
                userName:'',
                password:'',
                nPassword:'',
                confirmNPassword:''
            },
            paRules: {
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入老密码", trigger: "blur" }
                ],
                nPassword:[
                    { required: true, message: "请输入新密码", trigger: "blur" }
                ],
                confirmNPassword: [
                    { required: true, message: "请再次输入新密码以验证", trigger: "blur" }
                ]
            },

        };
    },
    created() {
        this.$store.commit("clearTags");
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    // requestData('/login',this.param,'post').then((item)=>{
                    //     console.log('item:',item);
                    //     localStorage.setItem("token", item.data.token);
                    //     localStorage.setItem("stuId", item.data.user.stu_id);
                    // });

                    getStartDataFromBackend(this.param).then(()=>{
                        this.$router.push("/home/table");
                        this.$message.success("登录成功");
                    },(item)=>{
                        console.log('login err:',item);
                        this.$message.error("登录失败");
                    });

                    // this.$router.push("/home/table");

                    
                } else {
                    this.$message.error("请输入账号和密码");
                    return false;
                }
            });
        },
        changePassword(){
            console.log(this.nPassword);
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
    overflow: hidden;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: rgb(95, 208, 243);
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 14px;
    line-height: 30px;
    color: #fff;
}

.login-tipsPs {
    font-size: 14px;
    line-height: 30px;
    color: rgb(77, 88, 243);
    margin-left: 40px;
}



.chPassword {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -220px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.login-tipsPs:hover{
    cursor:pointer
}
</style>