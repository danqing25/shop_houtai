<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @display="display" :scene="scene" />
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加Spu</el-button
        >
        <el-table style="width: 100%" :data="list" boeder>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="300px"
            align="center"
          >
            <template v-slot="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看相关所有sku"
                @click="skuDialog(row)"
              ></el-button>
              <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                  style="margin: 0 10px"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="getList"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="3"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 添加/修改spu -->
      <SpuForm
        v-show="scene == 1"
        ref="spuForm"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加sku -->
      <SkuForm v-show="scene == 2" ref="skuForm" @changeScene="changeScene"></SkuForm>
    </el-card>

    <!-- sku列表对话框 -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
      <el-table
        :data="skuList"
        style="width: 100%"
        border
        v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
        align="center">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="width"
        align="center">
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
        align="center">
        </el-table-column>
        <el-table-column
          label="默认图片"
          width="width"
        align="center">
          <template v-slot="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "@/views/product/Spu/SpuForm";
import SkuForm from "@/views/product/Spu/SkuForm";
import { reqSpuList, reqDeleteSpu, reqSpuSkuList } from "@/api/product/spu";

export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      total: 0,
      page: 1,
      limit: 3,
      // Spu列表
      list: [],
      scene: 0, // 控制切换显示 0--spu列表展示；1--添加/修改spu；2--添加sku
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      // 加载效果
      loading: true
    };
  },
  methods: {
    display({ categoryId, level }) {
      // id发生变化就清空列表，展示原始场景
      this.list = [];
      this.scene = 0;

      if (level == 1) {
        this.category1Id = categoryId;
        // 当1id发生变化时，清空其他
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 业务要求：有3id时才发送请求
        this.getList();
      }
    },
    async getList(page = 1) {
      this.page = page;
      const result = await reqSpuList(this.page, this.limit, this.category3Id);
      if (result.code == 200) {
        this.list = result.data.records;
        this.total = result.data.total;
      }
    },

    handleSizeChange(limit) {
      this.limit = limit;
      this.getList();
    },

    addSpu() {
      this.scene = 1;
      // 获取子组件，每次点击时都需要发送请求
      this.$refs.spuForm.getAddData(this.category3Id);
    },
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件，每次点击时都需要发送请求
      this.$refs.spuForm.getSpuFormData(row);
    },
    async deleteSpu(row) {
      const result = await reqDeleteSpu(row.id)
      if(result.code == 200) {
        this.$message({type: 'success', message: '删除成功！'})
        if(this.list.length < 1 && this.page != 1) {
          this.getList(this.page - 1)
        } else {
          this.getList(this.page)
        }
      }
    },

    addSku(row) {
      this.scene = 2
      // 父组件调用子组件方法
      this.$refs.skuForm.geData(row, this.category1Id, this.category2Id)
    },

    // 自定义事件——改变scene，切换显示
    changeScene({ scene, flag }) {
      this.scene = scene;
      // 重新请求spu列表
      if (flag == "修改") {
        this.getList(this.page);
      } else if (flag == "添加"){
        this.getList();
      } else {  // 取消操作无需发请求重新获取spu列表
        return
      }
    },

    // spu对应的sku列表
    async skuDialog(row) {
      this.dialogTableVisible = true
      this.spu = row
      //清空上一次数据
      this.skuList = []
      this.loading = true

      const result = await reqSpuSkuList(row.id)
      if(result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    }
  },
};
</script>

<style>
</style>