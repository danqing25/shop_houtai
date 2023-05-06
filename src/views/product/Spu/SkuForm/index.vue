<template>
  <!-- Spu管理的添加sku功能的结构 -->
  <el-form ref="form" label-width="80px" :model="formData">
    <el-form-item label="Spu名称">
      {{ spuName }}
    </el-form-item>
    <el-form-item label="Sku名称">
      <el-input placeholder="Sku名称" v-model="formData.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="formData.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)" v-model="formData.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" rows="4" placeholder="规格描述" v-model="formData.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="attr.attrName" v-for="attr in attrList" :key="attr.id">
          <el-select placeholder="请选择" v-model="attr.attrIdAndAttrValueId">
            <el-option :label="attrValue.valueName" :value="`${attrValue.id}:${attrValue.attrId}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="spuSaleAttr.saleAttrName" v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id">
          <el-select placeholder="请选择" v-model="spuSaleAttr.saleAttrIdAndSaleAttrValueId">
            <el-option :label="saleAttrValue.saleAttrValueName" :value="`${spuSaleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in spuSaleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table :data="spuImageList" style="width: 100%" @selection-change="handleSelectionChange" border>
        <!-- selection-change：当选择项发生变化时会触发该事件 -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="imgUrl" label="图片" width="width">
          <template v-slot="{row}">
            <img :src="row.imgUrl" style="width:100px;height:100px">
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template v-slot="{row}">
            <el-button type="primary" v-if="row.isDefault == '0'" @click="changeDefault(row)">设为默认</el-button>
            <el-button v-else>默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reqSpuImage, reqSpuSaleAttr, saveSkuForm } from "@/api/product/spu";
import { reqAttrList } from "@/api/product/attr";

export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrList: [],
      spuName: '',
      formData: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: '',
        price: 0,
        weight: 0,
        skuDesc: '',
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuDefaultImg: '',
        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      checkImageList: [],  // 暂存选中的图片（不能直接发服务器，缺少“默认”字段）
    };
  },
  methods: {
    async geData(spu, category1Id, category2Id) {
      this.spuName = spu.spuName;
      this.formData.category3Id = spu.category3Id
      this.formData.spuId = spu.id
      this.formData.tmId = spu.tmId
      const spuImage = await reqSpuImage(spu.id);
      if (spuImage.code == 200) {
        spuImage.data.forEach(element => {
          element.isDefault = '0'
        });
        this.spuImageList = spuImage.data
      }
      const spuSaleAttr = await reqSpuSaleAttr(spu.id);
      if (spuSaleAttr.code == 200) {
        this.spuSaleAttrList = spuSaleAttr.data;
      }
      // 获取平台全部属性
      const attrList = await reqAttrList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrList.code == 200) {
        this.attrList = attrList.data;
      }
    },

    // 表格选中状态
    handleSelectionChange(val) {
      // val是选中的图片信息列表
      this.checkImageList = val  //缺少“默认”字段
    },
    // 更改默认图片
    changeDefault(row) {
      // 排他思想
      this.spuImageList.forEach((element) => {
        element.isDefault = '0'
      });
      row.isDefault = '1'
      // 设置默认图片地址
      this.formData.skuDefaultImg = row.imgUrl
    },

    async save() {
      // 整理参数
      const {attrList, spuSaleAttrList, formData, checkImageList} = this
        // 平台属性
        attrList.forEach((element) => {
          if(element.attrIdAndAttrValueId) {
            const [attrId, valueId] = element.attrIdAndAttrValueId.split(':')
            formData.skuAttrValueList.push({attrId, valueId})
          }
        })
        // 销售属性
        formData.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
          if(item.saleAttrIdAndSaleAttrValueId) {
            const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndSaleAttrValueId.split(':')
            prev.push({saleAttrId, saleAttrValueId})
          }
          return prev
        }, [])
        // 图片
      formData.skuImageList = checkImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      // 发请求
      const result = await saveSkuForm(formData)
      if(result.code == 200) {
        this.$message({type: 'success', message: '保存成功！'})
        // 切换显示
        this.$emit('changeScene', {scene: 0, flag: ''})
        // 数据清空
        Object.assign(this._data, this.$options.data())
      }
    },
    cancel() {
      this.$emit('changeScene', {scene: 0, flag: ''})
      // 数据清空
      Object.assign(this._data, this.$options.data())
    }
  },
};
</script>

<style>
</style>