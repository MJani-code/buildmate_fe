<template>
  <v-card>
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
    <response-handler-modal></response-handler-modal>
    <UploadFile
      :uploadDialog="uploadDialog"
      @save="postData"
      @close="closeDialog"
    ></UploadFile>
    <v-btn class="ma-10" @click="openUploadDialog">Új dokumentum</v-btn>
    <v-btn class="ma-10" @click="getData">Get data</v-btn>
    <v-btn class="ma-10" @click="postData">Post data</v-btn>
    <v-col lg="3" xl="3">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Keresés"
          single-line
          hide-details
          color="#359756"
        ></v-text-field>
      </v-card-title>
    </v-col>
    <v-data-table :headers="headers" :items="documents" :search="search">
      <template v-slot:item.actions="{ item, index }">
        <div>
          <!-- Első státusz, nyitott státusz. Utalásra vár. Csak akkor van státusz léptetési funkciója, ha a belépett userRole = admin -->
          <v-btn
            v-if="item.typeId == 2 && item.statusId == 1"
            icon
            @click="openDialog('confirm', index)"
            ><v-icon size="20">mdi-cash-clock</v-icon></v-btn
          >
          <!-- Második státusz, elutalva. Jóváhagyásra vár. Csak akkor van státusz léptetési funkciója, ha a belépett userRole = admin -->
          <v-btn
            v-if="item.typeId == 2 && item.statusId == 2"
            icon
            @click="openDialog('confirm', index)"
            ><v-icon size="20">mdi-cash-sync</v-icon></v-btn
          >
          <!-- Harmadik státusz, a pénz beérkezett az igénylő számlájára. Csak akkor van státusz léptetési funkciója, ha a belépett user megegyezik a számlát feltöltő userrel. -->
          <v-btn
            v-if="item.typeId == 2 && item.statusId == 3"
            icon
            @click="openDialog('confirm', index)"
            ><v-icon size="20">mdi-cash-check</v-icon></v-btn
          >

          <v-btn :href="item.url" icon
            ><v-icon size="20">mdi-eye</v-icon></v-btn
          >
          <v-btn @click="openDialog('edit', index)" icon
            ><v-icon size="20">mdi-pencil-outline</v-icon></v-btn
          >
          <v-btn @click="openDialog('download', index)" icon
            ><v-icon size="20">mdi-download-outline</v-icon></v-btn
          >
          <v-btn @click="openDialog('delete', index)" icon
            ><v-icon size="20">mdi-delete-outline</v-icon></v-btn
          >
        </div>
        <div></div>
      </template>
    </v-data-table>
    <DialogFieldVue
      :itemDialog="itemDialog"
      :dialogType="dialogType"
      :editedItem="editedItem"
      @save="saveItem"
      @delete="deleteItem"
      @close="closeDialog"
      @confirm="updateInvoice"
    />
  </v-card>
</template>


<script>
import DialogFieldVue from "../../components/Fields/DialogField.vue";
import UploadFile from "../../components/Fields/UploadFile.vue";
import Alert from "../../components/Alert.vue";
import ResponseHandlerModal from "../../components/ResponseHandlerModal";
import axios from "axios";
import { APIGET, APIUPLOAD, APIPOST } from "~/api/apiHelper";

export default {
  components: {
    DialogFieldVue,
    UploadFile,
    Alert,
    ResponseHandlerModal,
  },
  data() {
    return {
      showAlert: false,
      alertMessage: "",
      alertType: "",
      itemDialog: false,
      uploadDialog: false,
      showAlert: false,
      alertMessage: "",
      typeId: 1,
      alertType: "Dokumentum",
      statusId: 5,
      typeId: 1,
      dialogType: "Dokumentum",
      statusId: 5,
      editedItem: {},
      deletedItem: {
        index: "",
        id: 1,
        name: "",
      },
      editedIndex: -1,
      deletedIndex: -1,
      isLoading: false,
      search: "",
      headers: [
        {
          text: "Dokumentum neve",
          align: "start",
          filterable: true,
          value: "title",
        },
        { text: "Feltöltés dátuma", value: "createdAt" },
        { text: "Feltöltötte", value: "createdBy" },
        { text: "Státusz", value: "status" },
        { text: "Típus", value: "type" },
        { text: "Műveletek", align: "center", value: "actions" },
      ],
      documents: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const response = await APIGET("getDocumentsData");
        this.documents = response.data.result;

      } catch (error) {
        this.checkError(error, {
          show: true,
          title: "Hiba",
          message: `Hiba történt az adatok lekérése közben: ${error.code} - ${error.name} - ${error.message}`,
          options: [],
          type: {
            action: "error",
          },
        });
      }
    },
    async postData(data) {
      try {
        const response = await APIUPLOAD("addDocumentsData", data);

        if (response.data.confirm == true) {
          this.getData();

          this.uploadDialog = false;
          //If succes
          this.alertMessage = "A mentés sikeres volt!";
          this.alertType = "success";
          this.showAlert = true;
          if ((this.showAlert = true)) {
            setTimeout(() => {
              this.showAlert = false; // Az értesítés elrejtése
            }, 3000);
          }
        }
      } catch (error) {
        this.checkError(error, {
          show: true,
          title: "Hiba",
          message: `Hiba történt az adatok lekérése közben: ${error.code} - ${error.name} - ${error.message}`,
          options: [],
          type: {
            action: "error",
          },
        });
      }
    },
    openDialog(dialogType, index) {
      this.dialogType = dialogType;
      if (dialogType !== "download") {
        this.itemDialog = true;
        this.editedItem = Object.assign({}, this.documents[index]);
      }
    },
    openUploadDialog() {
      this.uploadDialog = true;
    },
    saveItem() {
      // implement save logic here
      this.itemDialog = false;
      // If error

      //If succes
      this.alertMessage = "A mentés sikeres volt!";
      this.alertType = "success";
      this.showAlert = true;
      if ((this.showAlert = true)) {
        setTimeout(() => {
          this.showAlert = false; // Az értesítés elrejtése
        }, 3000);
      }
    },
    deleteItem() {
      // implement delete logic here
      this.itemDialog = false;
      // If error

      //If succes
      this.alertMessage = "A törlés sikeres volt!";
      this.alertType = "success";
      this.showAlert = true;
      if ((this.showAlert = true)) {
        setTimeout(() => {
          this.showAlert = false; // Az értesítés elrejtése
        }, 3000);
      }
    },
    closeDialog() {
      this.itemDialog = false;
      this.uploadDialog = false;
    },
    updateInvoice() {
      //implement update logic here on the id of invoice to be updated onto the next status id. this.editedItem-el azonosítható
      this.itemDialog = false;
      // If error

      //If succes
      this.alertMessage = "A mentés sikeres volt!";
      this.alertType = "success";
      this.showAlert = true;
      if ((this.showAlert = true)) {
        setTimeout(() => {
          this.showAlert = false; // Az értesítés elrejtése
        }, 3000);
      }
    },
  },
};
</script>


<style scoped>
.my-table >>> tr:hover {
  background-color: #359756 !important;
}
</style>
