<template>
  <el-form :model="searchForm" :inline="true" ref="searchFormRef">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="searchForm.name" autocomplete="off" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item label="联系电话" prop="phone">
      <el-input v-model="searchForm.phone" autocomplete="off" placeholder="请输入手机号码" />
    </el-form-item>
    <el-form-item>
      <el-button :icon="Search" type="primary" @click="getUser">搜索</el-button>
      <el-button :icon="Refresh" @click="searchFormRef.resetFields()">重置</el-button>
    </el-form-item>
  </el-form>
  <el-button type="primary" :icon="Plus" @click="dialogFormVisibleAdd = true" class="addButton">新增用户</el-button>
  <el-button type="danger" :icon="Close" @click="handleDeleteDispatch()" class="addButton">删除用户</el-button>
  <el-button type="success" :icon="Edit" @click="stateChange" class="addButton">修改用户</el-button>
  <el-table :data="table.data" stripe style="padding-top:10px,width: 100%" text-align="center" :v-loading="tableLoading"
    @selection-change="handleSelectionChange" @sort-change="sortChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="name" label="Name" />
    <el-table-column label="操作" width="170" align="center">
      <template #default="scope">
        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="pageTop" background :page-sizes="[5, 10, 20, 30]" layout="sizes, prev, pager, next, jumper, total"
    :total="table.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :page-size="table.pageSize" />
  <el-dialog v-model="dialogFormVisibleAdd" title="新增用户" width="500px" :close-on-click-modal="false" draggable>
    <el-form :model="form" :rules="rules" @keyup.enter="addUser(formRef)" ref="formRef">
      <el-form-item label="登录名" label-width="100px" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" label-width="100px" prop="password">
        <el-input v-model="form.password" placeholder="请输入登录密码" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
        <el-button type="primary" @click="addUser(formRef)">新增用户</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, Close, Plus, Edit } from '@element-plus/icons-vue';
import axios from 'axios';

const tableLoading = ref(false);
const table = reactive({
  data: [],
  total: 0,
  pageSize: 5,
  currentPage: 1,
  orderDirection: "asc",
  orderField: "id"
});

interface User {
  id: string
  name: string
}

const dialogFormVisibleAdd = ref(false);

const form = ref({
  name: "",
  password: "",
});

const searchForm = ref({
  name: "",
  phone: "",
});

const formRef = ref();
const searchFormRef = ref();

const rules = ref({
  name: [{
    required: true, message: "姓名不能为空", trigger: "blur"
  }],
  password: [{
    required: true, message: "密码不能为空", trigger: "blur"
  }],
});

const sortChange = (column: any) => {
  table.orderField = column.prop;
  table.orderDirection = column.order;
  getUser();
}
const stateChange = (row: any) => {
  let title = row.state == false ? "是否禁用名称为" : "是否启用名称为";
  ElMessageBox.confirm(title + row.name + "的用户？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      tableLoading.value = true;
      let params = new URLSearchParams();
      params.append("id", row.id);
      params.append("state", String(row.state));
      axios.post("user/updateUserStateById", params)
        .then((res: any) => {
          let result = res.data;
          console.log(result)
          if (result.code == 200) {
            ElMessage.success("更新成功");
          } else {
            ElMessage.error("更新失败");
          }
          getUser();
        });
    })
    .catch(() => {
      ElMessage.info("操作取消");
      row.state = !row.state;
    });
}

const handleDelete = (row: User) => {
  ElMessageBox.confirm("是否删除名称为" + row.name + "的用户？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      let params = new URLSearchParams();
      params.append("id", row.id);
      axios.post("user/deleteUserById", params)
        .then((res: any) => {
          if (res.data.code == 200) {
            ElMessage.success("删除成功");
            getUser();
          } else {
            ElMessage.error("删除失败");
          }
        });
    })
    .catch(() => {
      ElMessage.info("操作取消");
    });
};


const handleSizeChange = function (val: number) {
  table.pageSize = val;
  getUser();
};

const handleCurrentChange = function (val: number) {
  table.currentPage = val;
  getUser();
};

function getUser() {
  let params = new URLSearchParams();
  params.append("pageSize", String(table.pageSize));
  params.append("currentPage", String(table.currentPage));
  params.append("orderField", String(table.orderField));
  params.append("orderDirection", String(table.orderDirection));
  params.append("name", String(searchForm.value.name));
  params.append("phone", String(searchForm.value.phone));
  axios.post("user/getAllUser", params).then((res: any) => {
    table.data = res.data.data.content;
    table.total = res.data.data.totalElements;
    tableLoading.value = false;
  });
}

function addUser(formSubmit: any) {
  formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("name", value.name);
      params.append("password", value.password);
      axios.post("user/addUser", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("新增用户成功");
            dialogFormVisibleAdd.value = false
            formSubmit.resetFields();
            getUser();
          } else {
            ElMessage.error("新增用户失败,用户名重复");
          }
        });
    } else {
      return false;
    }
  });
}
const multipleSelection = ref<User[]>();

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const handleDeleteDispatch = () => {

  ElMessageBox.confirm("是否删除多个用户？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      if (multipleSelection.value) {
        multipleSelection.value.forEach(row => {
          let params = new URLSearchParams();
          params.append("id", row.id);
          axios.post("user/deleteUserById", params)
            .then((res: any) => {
              if (res.data.code == 200) {
                ElMessage.success("删除成功");
                getUser();
              } else {
                ElMessage.error("删除失败");
              }
            });
        })
      } else {
        ElMessage.warning("至少选择一个用户");
      }
    }).catch(() => {
      ElMessage.info("操作取消");
    });
}

onMounted(() => {
  getUser();
});
</script>

<style scoped>
.pageTop {
  margin-top: 20px;
}

.el-table__header th {
  color: #333;
  background-color: #eee;
  font-weight: bold;
}
</style>
