<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <hotSearch />
    </el-col>
    <el-col :span="12">
      <categoryScale />
    </el-col>
  </el-row>
</template>

<script>
import hotSearch from "./hotSearch";
import categoryScale from "./categoryScale";

export default {
  name: "Observe",
  components: { hotSearch, categoryScale },
};
</script>

<style>
</style>