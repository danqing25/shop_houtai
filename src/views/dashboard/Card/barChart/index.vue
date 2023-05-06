<template>
  <div style="width: 100%; height: 100%" ref="barChart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "barChart",
  mounted() {
    let myChart = echarts.init(this.$refs.barChart);
    myChart.setOption({
      xAxis: {
        show: false,
        // 均分
        type: "category",
      },
      yAxis: { show: false },
      series: [
        {
          type: "bar",
          data: [5, 20, 10, 12, 15, 20, 10, 33, 23, 15, 23, 17],
          color: "blue",
        },
      ],
      // 布局
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });
  },
};
</script>

<style>
</style>