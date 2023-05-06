<template>
  <el-card>
    <div class="card-header">
        <div>{{title}}</div>
        <span class="el-icon-info"></span>
    </div>
    <div class="card-context">{{count}}</div>
    <div class="card-charts">
        <slot name="charts">
        </slot>
    </div>
    <div class="card-footer">
        <slot name="footer">
        </slot>
    </div>
  </el-card>
</template>

<script>
export default {
    name: 'Detail',
    props: ['title', 'count']
}
</script>

<style>
.card-header {
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
}
.card-context {
    font-size: 30px;
    padding: 10px 0;
}
.card-charts {
    height: 50px;
    line-height: 50px;
    font-size: 0.16rem;
}
.card-footer {
    border-top: 1px solid #eee;
    padding-top: 5px;
    font-size: 15px;
}
</style>