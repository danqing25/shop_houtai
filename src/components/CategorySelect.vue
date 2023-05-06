<template>
  <div>
    <!-- inline代表行内表单 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
        <el-form-item label="一级列表">
            <!-- change：选中值发生变化时触发 -->
            <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1">
                <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="二级列表">
            <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2">
                <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="三级列表">
            <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3">
                <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {reqCategoryList1, reqCategoryList2, reqCategoryList3} from '@/api/product/attr'

export default {
    name: 'CategorySelect',
    // props: ['check'],    // :disabled="check"添加属性时不能选择
    data() {
        return {
            list1: [],
            list2: [],
            list3: [],
            cForm: {
                category1Id: '',
                category2Id: '',
                category3Id: ''
            }
        }
    },
    methods: {
        async getCategoryList1() {
            const result = await reqCategoryList1()
            if(result.code == 200) {
                this.list1 = result.data
            }
        },
        async handler1() {
            // 根据一级列表获取二级

            // 置空
            this.cForm.category2Id = ''
            this.cForm.category3Id = ''
            this.list3 = ''

            const result = await reqCategoryList2(this.cForm.category1Id)
            if(result.code == 200) {
                this.list2 = result.data
            }

            this.$emit('display', {categoryId: this.cForm.category1Id, level: 1})
        },
        async handler2() {
            // 根据一级列表获取二级

            // 置空
            this.cForm.category3Id = ''

            const result = await reqCategoryList3(this.cForm.category2Id)
            if(result.code == 200) {
                this.list3 = result.data
            }

            this.$emit('display', {categoryId: this.cForm.category2Id, level: 2})
        },
        handler3() {
            this.$emit('display', {categoryId: this.cForm.category3Id, level: 3})  // 如果只在3传，2、1改变时不会触发，无法实现属性展示列表的清空
        }
    },
    mounted() {
        this.getCategoryList1()
    },
}
</script>

<style>

</style>