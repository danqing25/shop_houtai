<template>
  <!-- Spu管理的添加/修改spu功能的结构 -->
  <el-form ref="form" label-width="80px">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
        <el-option
          :label="item.tmName"
          :value="item.id"
          v-for="item in trademarkList"
          :key="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        rows="4"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- on-preview	点击文件列表中已上传的文件时的钩子
           on-remove	文件列表移除文件时的钩子
           list-type	文件列表的类型
           file-list	上传的文件列表,必须要有name和url字段 -->
      <el-upload
        action="dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :file-list="spuImageList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="saleAttr">
        <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"></el-option>
      </el-select>
      <el-button type="primary" style="margin: 0 5px" :disabled="!saleAttr" @click="addSaleAttr">添加销售属性</el-button>
      <el-table :data="spuInfo.spuSaleAttrList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="属性名称列表" width="width">
          <template v-slot="{ row }">
            <el-tag
              :key="tag.id"
              v-for="(tag, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="$event.target.blur"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="80px" align="center">
          <template v-slot="{row, $index}">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="spuInfo.spuSaleAttrList.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addAndUpdate">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  reqSpuInfo,
  reqTrademark,
  reqSpuImage,
  reqSaleAttr,
  reqAddOrUpdate
} from "@/api/product/spu";
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuInfo: {
        category3Id: 0,
        description: "",
        spuImageList: [],
        spuName: "",
        spuSaleAttrList: [],
        // 品牌的id
        tmId: '',
      },
      trademarkList: [],
      spuImageList: [],
      saleAttrList: [],
      saleAttr: ''  // select选择的销售属性id和名称
    };
  },
  computed: {
    unSelectSaleAttr() {
      const result = this.saleAttrList.filter((element) => {
        return this.spuInfo.spuSaleAttrList.every((item) => {
          return element.name != item.saleAttrName;
        })
      })

      return result
    }
  },
  methods: {
    // 获取表单初始化数据
    async getSpuFormData(row) {
      // 获取spu数据
      const spuResult = await reqSpuInfo(row.id);
      if (spuResult.code == 200) {
        this.spuInfo = spuResult.data;
      }
      // 获取品牌
      const TrademarkResult = await reqTrademark();
      if (TrademarkResult.code == 200) {
        this.trademarkList = TrademarkResult.data;
      }
      // 获取spu图片
      const spuImageResult = await reqSpuImage(row.id);
      if (spuImageResult.code == 200) {
        // 根据上传图片的file-list(必须要有name和url字段)要求进行修改
        spuImageResult.data.forEach((element) => {
          element.name = element.imgName;
          element.url = element.imgUrl;
        });
        this.spuImageList = spuImageResult.data;
      }
      // 获取销售属性
      const saleAttrResult = await reqSaleAttr();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    // 添加时获取品牌、销售属性
    async getAddData(category3Id) {
      this.spuInfo.category3Id = category3Id
      // 获取品牌
      const TrademarkResult = await reqTrademark();
      if (TrademarkResult.code == 200) {
        this.trademarkList = TrademarkResult.data;
      }
      // 获取销售属性
      const saleAttrResult = await reqSaleAttr();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },

    // 照片墙
    handleRemove(file, fileList) {
      // console.log(file, fileList);   file--当前删除的图片；fileList--改变后的图片列表
      // 注意：提交给服务器的数据无name、url字段，后需要整理
      this.spuImageList = fileList;
    },
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.saleAttr.split(':')
      let newSaleAttr = {baseSaleAttrId, saleAttrName, spuSaleAttrValueList: []}
      // 不能重复添加
      const res = this.spuInfo.spuSaleAttrList.some((item) => {
        return item.baseSaleAttrId == newSaleAttr.baseSaleAttrId
      })
      if(res) {
        this.$message({type: 'warning', message: `${saleAttrName}已存在，不能重复添加！`})
        return;
      } else {
        this.spuInfo.spuSaleAttrList.push(newSaleAttr);
      }
    },
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row) {
      const {baseSaleAttrId, inputValue} = row;
      // 不为空
      if(inputValue.trim() == '') {
        this.$message({type: 'warning', message: '属性值不能为空！'});
        this.$refs.saveTagInput.$refs.input.focus();
        return;
      }
      // 去重
      const result = row.spuSaleAttrValueList.every((item) => item.saleAttrValueName != inputValue)
      if(result) {
        let newAttr = {baseSaleAttrId, saleAttrValueName: inputValue}
        row.spuSaleAttrValueList.push(newAttr)
      } else {
        this.$message({type: 'warning', message: '属性值重复！'});
        this.$refs.saveTagInput.$refs.input.focus();
        return;
      }
      
      // 切换为button
      row.inputVisible = false;
    },

    async addAndUpdate() {
      // 参数整理
      this.spuInfo.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      const result = await reqAddOrUpdate(this.spuInfo)
      if(result.code == 200) {
        this.$message({type: 'success', message: '保存成功！'})
        // 切换场景
        this.$emit('changeScene', {scene: 0, flag: this.spuInfo.id ? '修改' : '添加'})
        // 清空数据
          // _data是响应式数据；this.$options返回配置对象
        Object.assign(this._data, this.$options.data())
      }
    },
    cancel() {
      this.$emit('changeScene', {scene: 0, flag: ''})
      // 清空数据
        Object.assign(this._data, this.$options.data())
    }
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>