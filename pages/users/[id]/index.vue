<template>
  <div class="px-1 md:px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Profile" />

    <!-- Form for Profile -->
    <BaseForm :fields="fields" :editable="editable" @submit="saveUser" @cancel="cancelEdit" @back="goBack" @editable="enableEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUsersStore } from "~/stores/admin.ts";

const authStore = useAuthStore();
const usersStore = useUsersStore();

const route = useRoute();
const router = useRouter();
const userId = route.params.id;

const editable = ref(false);
const editableFromQuery = computed(() => route.query.edit === "true");

const fields = ref([]);

onMounted(async () => {
  editable.value = editableFromQuery.value;

  if (authStore.isAuthenticated) {
    await usersStore.fetchUserById(userId);
    const user = usersStore.users[0];

    if (user) {
      fields.value = [
        { key: "name", label: "Name", value: user.name, type: "text" },
        {
          key: "role", // Role field
          label: "Role",
          value: user.role,
          type: "select",
          options: [
            { value: "admin", label: "Admin", optionClass: "bg-red-500" },
            { value: "user", label: "User", optionClass: "bg-green-500" },
            { value: "viewer", label: "Viewer", optionClass: "bg-blue-500" },
            {
              value: "inactive",
              label: "Inactive",
              optionClass: "text-gray-500",
            },
          ],
        },
      ];
    }
  }
});

function goBack() {
  navigateTo({
    path: `/organization`,
  });
}

const cancelEdit = () => {
  editable.value = false;
  router.push({
    path: route.path,
    query: { ...route.query, edit: "false" },
  });
};

const enableEdit = () => {
  editable.value = true;
  router.push({
    path: route.path,
    query: { ...route.query, edit: "true" },
  });
};

function saveUser() {
  navigateTo({
    path: `/organization`,
  });
}
</script>
