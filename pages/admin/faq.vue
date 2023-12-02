<template>
  <v-container>
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
    <v-btn class="mb-4" @click="newDialog = true">Új hozzáadása</v-btn>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item, i) in items" :key="i">
        <v-expansion-panel-header>
          {{ item.title }}
          <div style="text-align: end">
            <v-icon
              style="justify-content: flex-end"
              @click.stop="updateItem($event, item, i)"
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
    <v-dialog v-model="newDialog" max-width="600">
      <v-card>
        <v-card-title> Új elem hozzáadása </v-card-title>
        <v-card-text>
          <v-text-field v-model="newItem.title" label="Cím" outlined dense>
          </v-text-field>
          <v-textarea v-model="newItem.description" outlined></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="newDialog = false">Mégsem</v-btn>
          <v-btn color="success" @click="saveItem">Mentés</v-btn>
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
          <v-btn color="success" @click="saveItem">Mentés</v-btn>
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
      newDialog: false,
      editDialog: false,
      confirmDialog: false,
      showAlert: false,
      alertMessage: "",
      alertType: "",
      userData: null,
      items: null,
      newItem: [
        {
          title: "",
          description: "",
        },
      ],
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
    updateItem(event, item, i) {
      event.stopPropagation();
      this.itemToEdit.id = item.id;
      this.itemToEdit.index = i;
      this.itemToEdit.title = item.title;
      this.itemToEdit.description = item.description;
      this.editDialog = true;
    },
    async saveItem() {
      //adatfrissítés
      if (
        this.itemToEdit.title === this.items[this.itemToEdit.index].title &&
        this.itemToEdit.description ===
          this.items[this.itemToEdit.index].description
      ) {
        this.editDialog = false;
        this.showServerResponse();
      }else{
        const item = this.itemToEdit;
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
      }
      // TODO Új elem létrehozása

    },
    deleteItem(event, item) {
      event.stopPropagation();
      this.itemToDelete.id = item.id;
      this.confirmDialog = true;
    },
    confirmDeletion() {},
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