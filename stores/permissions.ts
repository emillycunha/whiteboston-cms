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
    canManageOrganizations: true,
  },
  admin: {
    canView: true,
    canAddContent: true,
    canAddFields: true,
    canAddCollections: true,
    canEdit: true,
    canDelete: true,
    canManageOrganizations: false,
  },
  user: {
    canView: true,
    canAddContent: true,
    canAddFields: false,
    canAddCollections: false,
    canEdit: false,
    canDelete: false,
    canManageOrganizations: false,
  },
  viewer: {
    canView: true,
    canAddContent: false,
    canAddFields: false,
    canAddCollections: false,
    canEdit: false,
    canDelete: false,
    canManageOrganizations: false,
  },
  none: {
    canView: false,
    canAddContent: false,
    canAddFields: false,
    canAddCollections: false,
    canEdit: false,
    canDelete: false,
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
