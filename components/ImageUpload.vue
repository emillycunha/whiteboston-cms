<template>
  <div class="p-2">
    <div class="border border-dashed border-gray-300 rounded-sm px-4 py-8 mb-4">
      <div
        class="flex flex-row justify-center gap-x-4 items-center mb-2"
        :class="{ 'is-dragover': isDragOver }"
        @drop="onDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <p class="text-base font-medium text-gray-800">Drag image here</p>
        <p class="text-sm text-gray-600">or</p>
        <button
          type="button"
          class="bg-violet-200 text-gray-800 px-2 py-1 rounded-lg text-sm"
          @click="triggerFileInput"
        >
          Choose File
        </button>

        <input
          type="file"
          ref="fileInput"
          accept="image/jpeg, image/jpg, image/png, image/webp"
          class="file-input"
          hidden
          @change="onFileChange"
        />
      </div>

      <!-- Display the file name (if any) after the file is selected -->
      <div v-if="fileName">
        <p>Selected file: {{ fileName }}</p>
      </div>

      <!-- Display loading text while uploading -->
      <div v-if="isUploading">
        <p>Uploading...</p>
      </div>

      <!-- Display loading text while fetching the URL -->
      <div v-if="isFetchingUrl">
        <p>Fetching image URL...</p>
      </div>

      <!-- Display success message if uploaded successfully -->
      <div
        v-if="successMessage"
        class="text-violet-500 italic text-sm text-center"
      >
        <p>{{ successMessage }}</p>
      </div>
    </div>
    <!-- Display error message if any -->
    <div v-if="errorMessage" class="text-red-500 text-sm text-center">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { $supabase } = useNuxtApp();
const model = defineModel();

// State variables
const file = ref(null);
const isUploading = ref(false);
const isFetchingUrl = ref(false);
const fileName = ref(model.value ? model.value.split("/").pop() : "");

const errorMessage = ref(null);
const successMessage = ref(null);

const isDragOver = ref(false);

// Handle file drop
const onDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  const droppedFile = event.dataTransfer.files[0];
  onFileChange({ target: { files: [droppedFile] } });
};

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const onFileChange = (event) => {
  const selectedFile = event.target.files[0];

  if (!selectedFile) return;

  // Reset messages before validation
  errorMessage.value = null;
  successMessage.value = null;

  // Validate file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(selectedFile.type)) {
    errorMessage.value = "Invalid file type! Please select an image file.";
    return;
  }

  // Validate file size
  if (selectedFile.size > MAX_FILE_SIZE) {
    errorMessage.value = "File is too large! Maximum size is 5 MB.";
    return;
  }

  file.value = selectedFile;
  fileName.value = selectedFile.name;
  uploadImage();
};

// Upload the image to Supabase
const uploadImage = async () => {
  if (!file.value) return;
  isUploading.value = true;

  // Reset messages before uploading
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const fileName = `public/${Date.now()}_${file.value.name}`;

    // Upload the image to Supabase storage
    const { data, error } = await $supabase.storage
      .from("whiteboston-cms-media")
      .upload(fileName, file.value);

    if (error) {
      errorMessage.value = "Error uploading file.";
      throw error;
    }

    // Fetch the public URL after the image has been uploaded
    await fetchPublicUrl(fileName);
  } catch (error) {
    console.error("Error in upload:", error);
  } finally {
    isUploading.value = false;
  }
};

// Fetch the public URL of the uploaded image
const fetchPublicUrl = async (fileName) => {
  isFetchingUrl.value = true;

  try {
    // Fetch the public URL of the image from Supabase
    const { data, error } = await $supabase.storage
      .from("whiteboston-cms-media")
      .getPublicUrl(fileName);

    if (error) {
      errorMessage.value = "Error fetching public URL.";
      throw error;
    }

    model.value = data.publicUrl;
    successMessage.value = "Image uploaded successfully!";
  } catch (error) {
    console.error("Error fetching public URL:", error);
  } finally {
    isFetchingUrl.value = false;
  }
};
</script>
