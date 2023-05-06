<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @display="display" />
    </el-card>
    <el-card>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category3Id"
        @click="addAttr"
        >添加属性</el-button
      >
      <div v-show="isShow">
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值" width="width">
            <!-- 这个单元格内部还有结构，需要通过数据遍历决定 -->
            <template v-slot="{ row }">
              <el-tag
                type="success"
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin: 0 10px"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="150px"
            align="center"
          >
            <template v-slot="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加/修改属性 -->
      <div v-show="!isShow">
        <el-form
          :inline="true"
          :model="attrInfo"
          ref="form"
          label-width="80px"
          style="margin: 10px 0"
        >
          <el-form-item label="属性名">
            <el-input
              placeholder="请添加属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValueName"
          >添加属性值</el-button
        >
        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 20px 0"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值" width="width">
            <template v-slot="{ row, $index }">
              <!-- input 和 span 切换显示 -->
              <el-input
                v-model.trim="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                :ref="$index"
                @blur="Lookup(row, $index)"
                @keyup.enter.native="enterHandler(row)"
              ></el-input>
              <span
                style="display: block"
                v-else
                @dblclick="toInput(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row, $index }">
              <!-- 气泡确认框  注意模板的elementUI版本    onConfirm事件点击确认按钮时触发 -->
              <el-popconfirm :title="`确定删除${row.valueName}`" @onConfirm="deleteAttrValue($index)">
                <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { reqAttrList, reqAddOrUpdateAttr, reqDeleteAttr } from "@/api/product/attr";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 属性列表
      attrList: [],
      isShow: true,
      // 修改/添加属性需要提交的数据
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
      // 暂存已有的valueName，以便修改为空时返回----span双击事件和input失焦均需访问
      temp: "",
      dialogVisible: false
    };
  },
  methods: {
    display({ categoryId, level }) {
      // 当上方选择其他时，下方展示数据清空    或者在添加/修改属性页面时禁用上方三级列表(props传递isShow)
      this.attrList = [];
      this.isShow = true;

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
        this.getAttrList();
      }
    },
    async getAttrList() {
      const result = await reqAttrList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },

    // 添加属性
    addAttr() {
      this.isShow = false;
      // 清空上一次的数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改属性
    updateAttr(row) {
      this.isShow = false;
      this.attrInfo = cloneDeep(row); // 涉及多层次--深拷贝
      // 为已有的属性值添加flag切换标记
      this.attrInfo.attrValueList.forEach((element) => {
        this.$set(element, "flag", false);
      });
    },
    // 删除属性
    deleteAttr(row) {
      this.$confirm(`确认删除“${row.attrName}”？`)
          .then(async () => {
            
            const result = await reqDeleteAttr(row.id)
            if(result.code == 200) this.$message(`“${row.attrName}”已成功删除！`)
            this.getAttrList()
          })
          .catch(_ => {})
    },

    // 添加属性值
    addAttrValueName() {
      // temp置空----新增的原有值一定为空
      this.temp = "";
      let { attrValueList } = this.attrInfo;

      // 不能生成多个空白的，必须上面有valueName才能继续添加
      const result =
        attrValueList.length > 0 &&
        attrValueList[attrValueList.length - 1].valueName === "";

      if (!result) {
        attrValueList.push({
          attrId: this.attrInfo.id,
          valueName: "",
          // 标记，以控制input和span的切换显示----true为input,false为span
          flag: true,
        });
      } else {
        alert("属性值不能为空，请重新填写");
        return false;
      }

      // input框自动聚焦
      this.$nextTick(() => {
        // 注意DOM不会立即更新
        this.$refs[attrValueList.length - 1].focus(); // 通过“添加属性值”按钮新增的一定是最后一个
      });
    },
    // 删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },

    // input失焦的回调，span显示
    Lookup(row, index) {
      // 属性值不能重复——查找时注意排除当前值
      // indexOf()方法：返回调用它的对象中第一次出现的指定值的索引
      const isRepeat = this.attrInfo.attrValueList.some((item, index) => {
        // if(this.attrInfo.attrList.indexOf(row) !== index) return row.valueName === item.valueName
        if (row !== item) return row.valueName === item.valueName;
      });
      if (isRepeat) {
        this.$message({
          type: "warning",
          message: `${row.valueName}已存在！请勿重复添加`,
        });
        return;
      }

      // 当前行没有内容的话就自动删除---原本有内容就保持不变
      if (row.valueName == "") {
        if (this.temp == "") {
          this.deleteAttrValue(index);
        } else {
          row.valueName = this.temp;
        }
      }

      // span显示
      row.flag = false;
    },
    enterHandler(row) {
      this.Lookup(row);
      if (row.flag == false) {
        this.addAttrValueName();
      }
    },
    // span双击事件
    toInput(row, index) {
      row.flag = true;
      // input框自动聚焦
      this.$nextTick(() => {
        // 注意DOM不会立即更新
        this.$refs[index].focus();
      });

      // 暂存已有的valueName，以便修改为空时返回---必须要在valueName变化之前(获取焦点时)
      this.temp = row.valueName;
    },

    async addOrUpdateAttr() {
      // 整理参数---发送给服务器的数据不应携带flag
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        delete item.flag
        return true
      })
      // 发送请求
      try {
        await reqAddOrUpdateAttr(this.attrInfo)
        this.getAttrList()
        this.$message({
          type: 'success',
          message: '保存成功！'
        })
        this.isShow = true
      } catch (error) {
      }
    },
  },
};
</script>

<style>
</style>