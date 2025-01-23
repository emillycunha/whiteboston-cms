import { defineStore } from "pinia";

type Role = "SuperAdmin" | "admin" | "user" | "viewer";

export const permissions = {
  SuperAdmin: {
    canView: true,
    canAddContent: true,
    canAddFields: true,
    canAddCollections: true,
    canEdit: true,
    canDelete: true,
    canManage: true,
    canManageOrganizations: true,
  },
  admin: {
    canView: true,
    canAddContent: true,
    canAddFields: true,
    canAddCollections: true,
    canEdit: true,
    canDelete: true,
    canManage: true,
    canManageOrganizations: false,
  },
  user: {
    canView: true,
    canAddContent: true,
    canAddFields: false,
    canAddCollections: false,
    canEdit: false,
    canDelete: false,
    canManage: false,
    canManageOrganizations: false,
  },
  viewer: {
    canView: true,
    canAddContent: false,
    canAddFields: false,
    canAddCollections: false,
    canEdit: false,
    canDelete: false,
    canManage: false,
    canManageOrganizations: false,
  },
  none: {
    canView: false,
    canAddContent: false,
    canAddFields: false,
    canAddCollections: false,
    canEdit: false,
    canDelete: false,
    canManage: false,
    canManageOrganizations: false,
  },
};

export const hasPermission = (
  role: Role | null,
  action: keyof (typeof permissions)["SuperAdmin"]
) => {
  const effectiveRole = role && permissions[role] ? role : "none";
  return permissions[effectiveRole][action] || false;
};

export const useMyPermissionsStore = defineStore("myPermissionsStore", {
  state: () => ({
    role: null as Role | null,
  }),
  getters: {
    // Get the full permissions object for the current role
    getPermissions: (state) => {
      return permissions[state.role || "none"];
    },
    // Check if the current role has a specific permission
    hasPermission:
      (state) => (action: keyof (typeof permissions)["SuperAdmin"]) => {
        return hasPermission(state.role, action);
      },
  },
  actions: {
    setRole(role: Role | null) {
      this.role = role;
    },
  },
});
