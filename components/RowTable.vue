<template>
  <div class="rounded-md bg-white shadow-sm border border-gray-200">
    <div class="flex flex-col gap-y-4 p-4 sm:p-10">
      <div
        v-for="(field, fieldIndex) in fields"
        :key="fieldIndex"
        class="flex flex-row items-center w-full py-2"
      >
        <label :for="`${fieldIndex}-${field.key}`" class="w-1/5 font-bold">
          {{ field.label }}:
        </label>
        <div class="w-1/2">
          <!-- Render textarea -->
          <textarea
            v-if="editable && field.type === 'textarea'"
            :id="`${fieldIndex}-${field.key}`"
            v-model="field.value"
            :rows="field.rows || 4"
            :placeholder="field.placeholder || ''"
            :required="field.required || false"
            :class="[
              'border border-gray-500 rounded-md p-2 w-full',
              field.inputClass,
            ]"
          ></textarea>

          <!-- Render select -->
          <select
            v-else-if="editable && field.type === 'select'"
            :id="`${fieldIndex}-${field.key}`"
            v-model="field.value"
            :required="field.required || false"
            :class="[
              'border border-gray-500 rounded-md p-2 w-full',
              field.inputClass,
            ]"
          >
            <option
              v-for="(option, optionIndex) in field.options"
              :key="optionIndex"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Render input -->
          <input
            v-else-if="editable"
            :id="`${fieldIndex}-${field.key}`"
            v-model="field.value"
            :type="field.type || 'text'"
            :placeholder="field.placeholder || ''"
            :required="field.required || false"
            :class="[
              'border border-gray-500 rounded-md p-2 w-full',
              field.inputClass,
            ]"
          />

          <!-- Render plain text for non-editable mode -->
          <p v-else>{{ field.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// Props for fields
defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => [],
  },
  editable: {
    type: Boolean,
    required: true,
    default: false,
  },
});
</script>
