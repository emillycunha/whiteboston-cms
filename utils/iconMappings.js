// utils/iconMappings.js
import {
  ChatBubbleLeftIcon,
  UsersIcon,
  UserPlusIcon,
  QueueListIcon,
  StarIcon,
  ShoppingCartIcon,
  DocumentIcon,
  CalendarIcon,
  FolderIcon,
} from "@heroicons/vue/24/outline";

export const iconMappings = [
  {
    keywords: ["blogs", "posts", "blog", "post"],
    icon: ChatBubbleLeftIcon,
  },
  {
    keywords: ["leads", "lead"],
    icon: UserPlusIcon,
  },
  {
    keywords: ["leads", "contacts", "lead", "contact", "clients", "client"],
    icon: UsersIcon,
  },
  {
    keywords: ["tasks", "lists", "task", "list"],
    icon: QueueListIcon,
  },
  {
    keywords: ["reviews", "feedback", "review"],
    icon: StarIcon,
  },
  {
    keywords: ["products", "items", "product", "item"],
    icon: ShoppingCartIcon,
  },
  {
    keywords: ["files", "documents", "file", "document"],
    icon: DocumentIcon,
  },
  {
    keywords: ["calendar", "events", "schedule", "event"],
    icon: CalendarIcon,
  },
];

// Default Icon
export const defaultIcon = FolderIcon;

/**
 * Get the corresponding icon for a given slug.
 *
 * @param {string} slug - The collection slug to match.
 * @returns {Component} The icon component for the slug or the default icon.
 */
export function getIconForSlug(slug) {
  if (typeof slug !== "string") {
    return defaultIcon;
  }

  const lowerCaseSlug = slug.toLowerCase();
  const mapping = iconMappings.find((mapping) =>
    mapping.keywords.includes(lowerCaseSlug)
  );

  if (mapping) {
    return mapping.icon;
  }
  return defaultIcon;
}
