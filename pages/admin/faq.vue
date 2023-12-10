<template>
  <v-container>
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
    <v-btn class="mb-4" @click="newItemDialog = true">Új hozzáadása</v-btn>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item, i) in items" :key="i">
        <v-expansion-panel-header>
          {{ item.title }}
          <div style="text-align: end">
            <v-icon
              style="justify-content: flex-end"
              @click.stop="editItem($event, item, i)"
              icon
              >mdi-pencil</v-icon
            >
            <v-icon
              style="justify-content: flex-end"
              @click.stop="deleteItem($event, item, i)"
              icon
              >mdi-delete-outline</v-icon
            >
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ item.description }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog v-model="newItemDialog" max-width="600">
      <v-card>
        <v-card-title> Új elem hozzáadása </v-card-title>
        <v-card-text>
          <v-text-field v-model="newItem.title" label="Cím" outlined dense>
          </v-text-field>
          <v-textarea v-model="newItem.description" outlined></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="newItemDialog = false">Mégsem</v-btn>
          <v-btn color="success" @click="addItem">Mentés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title> Szerkesztés </v-card-title>
        <v-card-text>
          <v-text-field v-model="itemToEdit.title" :value="itemToEdit.title">
          </v-text-field>
          <v-textarea
            filled
            v-model="itemToEdit.description"
            :value="itemToEdit.description"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="editDialog = false">Mégsem</v-btn>
          <v-btn color="success" @click="updateItem">Mentés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title> Esemény törlése </v-card-title>
        <v-card-text> Biztosan törölni szeretnéd ezt az eseményt? </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmDialog = false">Mégsem</v-btn>
          <v-btn color="error" @click="confirmDeletion">Törlés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import { APIGET, APIPOST, APIPOST2, APIUPLOAD } from "~/api/apiHelper";

export default {
  data() {
    return {
      newItemDialog: false,
      editDialog: false,
      confirmDialog: false,
      showAlert: false,
      alertMessage: "",
      alertType: "",
      userData: null,
      items: null,
      newItem: {
        title: "",
        description: "",
      },

      itemToEdit: {},
      itemToDelete: {},
    };
  },
  mounted() {
    const dataFromLocalStorage = localStorage.getItem("apiLogin");
    const parsedData = JSON.parse(dataFromLocalStorage);

    this.userData = parsedData;

    this.getFaqs();
  },
  methods: {
    async getFaqs() {
      try {
        const response = await APIPOST2("getFaqs", this.userData);
        if (response.data.result) {
          this.items = response.data.result;
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    editItem(event, item, i) {
      event.stopPropagation();
      this.itemToEdit.id = item.id;
      this.itemToEdit.index = i;
      this.itemToEdit.title = item.title;
      this.itemToEdit.description = item.description;
      this.editDialog = true;
    },
    async updateItem() {
      //adatfrissítés
      const item = this.itemToEdit;
      item.userId = this.userData.userId;
      const index = this.itemToEdit.index;

      try {
        const response = await APIPOST2("updateFaq", item);

        if (response.data.confirmUpdateFaqData == true) {
          this.editDialog = false;
          this.items[index] = item;
          this.showServerResponse();
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    async addItem() {
      //Új elem létrehozása
      const item = this.newItem;
      item.token = this.userData.token;

      try {
        const response = await APIPOST2("addFaq", item);
        if (response.data.confirmAddNewFaq == true) {
          this.newItemDialog = false;
          (this.newItem.title = ""),
            (this.newItem.description = ""),
            this.items.unshift(response.data);
          console.log(this.items);
          this.showServerResponse();
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    deleteItem(event, item, i) {
      event.stopPropagation();
      console.log(item);
      this.itemToDelete.id = item.id;
      this.itemToDelete.index = i;
      this.confirmDialog = true;
    },
    async confirmDeletion() {
      try {
        const response = await APIPOST2("deleteFaq", {
          id: this.itemToDelete.id,
        });
        if (response.data.confirmDeleteFaq == true) {
          this.items.splice(this.itemToDelete.index, 1);
          this.itemToDelete.id = "";
          this.itemToDelete.index = "";
          this.showServerResponse();
        } else {
          const error = response.data.error;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
      this.confirmDialog = false;
    },
    showServerResponse() {
      this.uploadDialog = false;
      //If succes
      this.alertMessage = "A művelet sikeres volt!";
      this.alertType = "success";
      this.showAlert = true;
      if ((this.showAlert = true)) {
        setTimeout(() => {
          this.showAlert = false; // Az értesítés elrejtése
        }, 3000);
      }
    },
    showServerError(error) {
      this.$store.dispatch("setResponseHandler", {
        show: true,
        title: "Hiba",
        message: error,
        options: [],
        type: {
          action: "error",
        },
      });
    },
    showCatchError(error) {
      this.$store.dispatch("setResponseHandler", {
        show: true,
        title: "Hiba",
        message: `Hiba történt az adatok lekérése közben: ${error.code} - ${error.name} - ${error.message}`,
        options: [],
        type: {
          action: "error",
        },
      });
    },
  },
};
</script>