<template>
  <div class="rounded-md bg-white shadow-sm border border-gray-200">
    <div class="flex flex-wrap gap-y-4 p-4 sm:p-10">
      <div
        v-for="(field, fieldIndex) in fields"
        :key="fieldIndex"
        :class="['flex', field.fullRow ? 'flex-col w-full' : ' flex-row w-1/2']"
      >
        <!-- Label -->
        <div class="w-full p-2">
          <label
            :for="`${fieldIndex}-${field.key}`"
            class="font-bold block mb-1"
          >
            {{ field.label }}:
          </label>
          <div>
            <slot
              :name="`field-${field.key}`"
              :field="field"
              :editable="editable"
            >
              <!-- Default Input Rendering -->
              <textarea
                v-if="editable && field.type === 'textarea'"
                :id="`${fieldIndex}-${field.key}`"
                v-model="field.value"
                :rows="field.rows || 4"
                :placeholder="field.placeholder || ''"
                v-bind="field.attrs || {}"
                :class="[
                  'border border-gray-500 rounded-md p-2 w-full',
                  field.inputClass,
                  field.error ? 'border-red-500' : '',
                ]"
              ></textarea>

              <select
                v-else-if="editable && field.type === 'select'"
                :id="`${fieldIndex}-${field.key}`"
                v-model="field.value"
                v-bind="field.attrs || {}"
                :class="[
                  'border border-gray-500 rounded-md p-2 w-full',
                  field.inputClass,
                  field.error ? 'border-red-500' : '',
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

              <input
                v-else-if="editable"
                :id="`${fieldIndex}-${field.key}`"
                v-model="field.value"
                :type="field.type || 'text'"
                :placeholder="field.placeholder || ''"
                v-bind="field.attrs || {}"
                :class="[
                  'border border-gray-500 rounded-md p-2 w-full',
                  field.inputClass,
                  field.error ? 'border-red-500' : '',
                ]"
              />
              <p v-else>{{ field.value }}</p>
              <p v-if="field.hint" class="text-gray-500 text-xs mt-1">
                {{ field.hint }}
              </p>
              <p v-if="field.error" class="text-red-500">{{ field.error }}</p>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
