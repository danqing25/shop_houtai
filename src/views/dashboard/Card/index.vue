<template>
  <el-row :gutter="10">
    <el-col :span="6">
        <Detail title="总销售额" count="￥ 126560">
            <template v-slot:charts>
            <span>周同比&nbsp;&nbsp;56.67%&nbsp;<svg t="1683166595877" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2735" width="16" height="16"><path d="M194.108395 621.186771 863.223758 621.186771 528.668123 251.67295Z" fill="#d81e06" p-id="2736"></path></svg></span>
            <span>日同比&nbsp;&nbsp;19.16%&nbsp;<svg t="1683166646467" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3988" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3989"></path></svg></span>
        </template>
        <template v-slot:footer>
            <span>日销售额￥&nbsp;12423</span>
        </template>
        </Detail>
    </el-col>
    <el-col :span="6">
    <Detail title="访问量" count="88460">
        <template v-slot:charts>
            <lineChart />
        </template>
        <template v-slot:footer>
            <span>日访问量&nbsp;1234</span>
        </template>
    </Detail>
    </el-col>
    <el-col :span="6">
    <Detail title="支付笔数" count="88460">
        <template v-slot:charts>
            <barChart />
        </template>
        <template v-slot:footer>
            <span>转化率&nbsp;65%</span></span>
        </template>
    </Detail>
    </el-col>
    <el-col :span="6">
    <Detail title="运营活动效果" count="78%">
        <template v-slot:charts>
            <progressChart />
        </template>
        <template v-slot:footer>
            <span>周同比&nbsp;&nbsp;12%&nbsp;<svg t="1683166595877" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2735" width="16" height="16"><path d="M194.108395 621.186771 863.223758 621.186771 528.668123 251.67295Z" fill="#d81e06" p-id="2736"></path></svg></span>
            <span>日同比&nbsp;&nbsp;11%&nbsp;<svg t="1683166646467" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3988" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3989"></path></svg></span>
        </template>
    </Detail>
    </el-col>
  </el-row>
</template>

<script>
import Detail from './Detail'
import lineChart from './Line'
import barChart from './barChart'
import progressChart from './progressChart'

export default {
    name: 'Card',
    components: {
        Detail,
        lineChart,
        barChart,
        progressChart
    }
}
</script>

<style>

</style>