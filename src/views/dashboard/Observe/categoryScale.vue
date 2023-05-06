<template>
  <el-card>
    <div slot="header" class="header">
      <span>销售额类别占比</span>
      <el-radio-group v-model="radio">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button>
      </el-radio-group>
    </div>
    <div style="width: 100%; height: 260px" ref="chart"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "categoryScale",
  data() {
    return {
        radio: '全部'
    }
  },
  mounted() {
    let myChart = echarts.init(this.$refs.chart);
    myChart.setOption({
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "哈哈哈" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    myChart.on("mouseover", (params) => {
      // params可以拿到鼠标事件的数据
      const { value, name } = params.data;
      // 重新设置标题
      myChart.setOption({
        title: {
          text: name,
          subtext: value,
          top: "center",
          left: "center",
        },
      });
    });
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
}
</style>