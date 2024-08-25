<template>
  <div class="container">
    <h1 class="naslov">New profile picture</h1>
    <form @submit.prevent="uploadToStorage">
      <div class="input-fields">
        <input
          type="file"
          @change="handleImageSelect"
          class="form-control picture-input"
          accept="image/*"
          required
        />
        <div class="submit">
          <button
            type="submit"
            class="btn btn-success btn-save"
            v-if="!loading"
          >
            Save Changes
          </button>
          <span
            v-else
            class="spinner-border spinner-border-lg"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import { inject } from "vue";
import { ref } from "vue";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore";

export default {
  name: "editProfilePictureModalBody",
  setup() {
    const storage = inject("firebaseStorage");
    const file = ref(null);
    const loading = ref(false);
    const usersCollectionStore = useUsersCollectionStore();

    const handleImageSelect = (event) => {
      file.value = event.target.files[0];
    };

    const uploadToStorage = async () => {
      if (!file.value) return;

      loading.value = true;

      const imageRef = storageRef(storage, `profileImages/${file.value.name}`);

      try {
        await uploadBytes(imageRef, file.value);
        const imageUrl = await getDownloadURL(imageRef);
        await saveImagePathToUserDB(imageUrl);
      } catch (error) {
        console.error("Error during upload:", error);
      } finally {
        loading.value = false;
      }
    };

    const saveImagePathToUserDB = async (imagePath) => {
      const email = localStorage.getItem("userEmail");
      const formData = {
        email: email,
        imagePath: imagePath,
      };

      const res = await usersCollectionStore.updateUserProfilePicture(formData);

      if (res.status >= 200 && res.status < 300) {
        eventBus.emit("updateUserImage", imagePath);
        eventBus.emit("closeModal", { closeModal: true });
        eventBus.emit("success", "Profile picture updated successfully!");
      } else {
        console.error("Failed to update image path in DB", res);
      }
    };
    return { file, loading, handleImageSelect, uploadToStorage };
  },
};
</script>

<style scoped>
.naslov {
  color: #d29433;
  text-align: center;
  margin-bottom: 5vw;
}
.spinner-border {
  color: #d29433;
}
.btn-save {
  border-radius: 20px;
  width: 300px;
  border: none;
}
.input-fields {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.picture-input {
  width: 450px;
  background-color: white;
}
.submit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3vw;
}
</style>
