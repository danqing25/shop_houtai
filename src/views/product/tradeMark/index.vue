<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="magin: 10px 0px" @click="addTradeMark"
      >添加</el-button
    >
    <!-- 表格组件
      data----表格中将来需要展示的数据--数组类型
      border----是否带有纵向边框

      prop----对应列内容的字段名，也可以使用 property 属性
      label----显示的标题
      width----对应列宽度
      align----标题对齐方式
     -->
    <el-table :data="list" style="width: 100%; margin-top: 10px" border>
      <el-table-column prop="id" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名"
        width="width"
        align="center"
      >
      </el-table-column>
      <!-- prop="logoUrl" 展示的是字符串 -->
      <el-table-column prop="logoUrl" label="LOGO" width="width" align="center">
        <!-- 向table传结构 -->
        <template scope="{row}">
          <!-- row是一个完整的对象{{row}} -->
          <img :src="row.logoUrl" width="100px" height="100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="editTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器----数据总条数、每页显示条数、当前页码、连续页码数量
      page-size:每页显示条数
      page-sizes：调整每页显示条数
      pager-count：页码按钮的数量，当总页数超过该值时会折叠

      current-change：currentPage改变时会触发--自动获取页码
      size-change：pageSize改变时会触发
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      layout="prev, pager, next, jumper,  ->, sizes, total"
      :total="total"
      :page-sizes="[3, 5, 10]"
      :page-size="3"
      :current-page="pager"
      :pager-count="7"
      @current-change="getTradeMarks"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 对话框 
      visible.sync：控制对话框显示或隐藏
    -->
    <el-dialog :title="formData.id ? '品牌修改' :'品牌添加'" :visible.sync="dialogFormVisible">
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules属性传入约定的验证规则，并将 Form-Item 的 prop属性设置为需校验的字段名即可 -->
      <el-form style="width: 80%" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="formData.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action：上传的地址 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.logoUrl" :src="formData.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestTradeMark, reqAddOrUpdateTradeMark, reqDeleteTrademark } from "@/api/product/tradeMark";

export default {
  name: "TradeMark",
  data() {
    return {
      list: [],
      total: 0,
      pager: 1,
      limit: 3,
      // 控制对话框显示或隐藏
      dialogFormVisible: false,
      // 收集表单信息
      formData: {
        logoUrl: "",
        tmName: ""
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO'}
        ]
      }
    };
  },
  methods: {
    async getTradeMarks(pager = 1) {
      this.pager = pager;
      const result = await requestTradeMark(this.pager, this.limit);
      if (result.code == 200) {
        this.list = result.data.records;
        this.total = result.data.records.length;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTradeMarks(); // 如果要保持当前页码不变，则传入this.pager
    },

    // 品牌添加或修改
    addTradeMark() {
      // 显示对话框
      this.dialogFormVisible = true
      // 清除残留数据
      this.formData = {logoUrl: "",tmName: ""}
    },
    editTradeMark(row) {
      // row：获取当前品牌的信息
      this.dialogFormVisible = true
      // this.formData = row  直接赋值，会导致row(页面)跟着变化
      this.formData = {...row}  // row只有一层，扩展运算符...浅拷贝
    },

    handleAvatarSuccess(res, file) {
      // console.log(res)
      this.formData.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    addOrUpdateTradeMark() {
      // 先判断是否校验通过
      this.$refs.formData.validate(async (valid) => {
          if (valid) {
            this.dialogFormVisible = false
            const result = await reqAddOrUpdateTradeMark(this.formData)
            if(result.code == 200) {
              // 弹出信息：增加/修改品牌成功
              this.$message({
                type: 'success',
                message: this.formData.id ? '修改品牌成功！' : '添加品牌成功！'
              })
              // 重新获取数据 修改停留在当前页
              this.getTradeMarks(this.formData.id ? this.pager : 1)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
      })
    },

    // 删除品牌
    deleteTrademark(row) {
      // 弹框
      this.$confirm(`确认删除${row.tmName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发请求删除数据
          let result = await reqDeleteTrademark(row.id)
          if (result.code == 200) {
              this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          this.getTradeMarks(this.list.length > 0 ? this.pager : this.pager - 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
    }
  },
  mounted() {
    this.getTradeMarks();
  },
}
</script>

<style>
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>