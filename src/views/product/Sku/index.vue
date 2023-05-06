<template>
  <div>
    <el-table :data="skuList" style="width: 100%" border>
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="prop"
        label="默认图片"
        width="width"
        align="center"
      >
        <template v-slot="{ row }">
          <img
            :src="row.skuDefaultImg"
            style="width: 80px; height: 80px"
          /> </template
      ></el-table-column>
      <el-table-column
        prop="weight"
        label="重量(KG)"
        width="width"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="价格(元)"
        width="width"
        align="center"
      ></el-table-column>
      <el-table-column prop="prop" label="操作" width="250px" align="center">
        <template v-slot="{ row }">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            v-if="row.isSale == 0"
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="sale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$message('正在开发中……')"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="showSkuInfo(row)"
          ></el-button>
          <!-- <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)"> -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
          <!-- </el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      :current-page="page"
      :page-sizes="[10, 20]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="show" :before-close="handleClose" size="50%">
      <el-row>
        <el-col :span="5">sku名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin: 0 5px"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">图片列表</el-col>
        <el-col :span="16">
          <!-- 轮播图 -->
          <el-carousel height="150px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import {
  reqSkuList,
  reqOnSale,
  reqCancelSale,
  reqSkuInfo,
} from "@/api/product/sku";

export default {
  name: "Sku",
  data() {
    return {
      total: 0,
      page: 1,
      limit: 10,
      skuList: [],
      skuInfo: {},
      show: false,
    };
  },
  methods: {
    async getSkuList(page = 1) {
      this.page = page;
      const result = await reqSkuList(this.page, this.limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.skuList = result.data.records;
      }
    },

    handleSizeChange(limit) {
      this.limit = limit;
    },

    // 上架
    async sale(row) {
      const result = await reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message.success("已上架！");
      }
    },
    // 下架
    async cancel(row) {
      const result = await reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message.success("已下架！");
      }
    },

    // 获取sku详细信息
    async showSkuInfo(row) {
      // 展示sku信息抽屉
      this.show = true;
      const result = await reqSkuInfo(row.id);
      this.skuInfo = result.data;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>


<style scoped>
.el-col {
  margin: 10px;
}
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
::v-deep .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

::v-deep .el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
::v-deep .el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
}
</style>