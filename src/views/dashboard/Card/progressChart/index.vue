<template>
  <div style="width: 100%; height: 100%" ref="progressChart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "progressChart",
  mounted() {
    let myChart = echarts.init(this.$refs.progressChart);
    myChart.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        // 均分
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "green",
          // 柱状图宽度
          barWidth: 10,
          // 背景颜色设置
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
          // 文本
          label: {
            show: true,
            formatter: "|",
            position: 'right',
          },
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