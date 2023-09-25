<template>
  <v-card>
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
    <response-handler-modal></response-handler-modal>
    <UploadFile
      :uploadDialog="uploadDialog"
      @save="postData"
      @close="closeDialog"
    ></UploadFile>
    <v-btn class="ma-10" @click="uploadDialog = !uploadDialog"
      >Új dokumentum</v-btn
    >
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
            @click="updateItem('confirm', item)"
            ><v-icon size="20">mdi-cash-clock</v-icon></v-btn
          >
          <!-- Második státusz, elutalva. Jóváhagyásra vár. Csak akkor van státusz léptetési funkciója, ha a belépett userRole = admin -->
          <v-btn
            v-if="item.typeId == 2 && item.statusId == 2"
            icon
            @click="updateItem('confirm', item)"
            ><v-icon size="20">mdi-cash-sync</v-icon></v-btn
          >
          <!-- Harmadik státusz, a pénz beérkezett az igénylő számlájára. Csak akkor van státusz léptetési funkciója, ha a belépett user megegyezik a számlát feltöltő userrel. -->
          <v-btn
            v-if="item.typeId == 2 && item.statusId == 3"
            icon
            @click="updateItem('confirm', item)"
            ><v-icon size="20">mdi-cash-check</v-icon></v-btn
          >

          <v-btn :href="item.url" icon
            ><v-icon size="20">mdi-eye</v-icon></v-btn
          >
          <v-btn @click="updateItem('edit', item)" icon
            ><v-icon size="20">mdi-pencil-outline</v-icon></v-btn
          >
          <v-btn @click="openDialog('download', index)" icon
            ><v-icon size="20">mdi-download-outline</v-icon></v-btn
          >
          <v-btn @click="updateItem('delete', item)" icon
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
      @update="saveItem"
      @close="closeDialog"
    />
  </v-card>
</template>


<script>
import DialogFieldVue from "../../components/Fields/DialogField.vue";
import UploadFile from "../../components/Fields/UploadFile.vue";
import Alert from "../../components/Alert.vue";
import ResponseHandlerModal from "../../components/ResponseHandlerModal";
import axios from "axios";
import { APIGET, APIUPLOAD, APIPOST2 } from "~/api/apiHelper";

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
      itemDialog: false,
      uploadDialog: false,
      alertMessage: "",
      typeId: 1,
      alertType: "Dokumentum",
      typeId: 1,
      dialogType: "Dokumentum",
      editedItem: {},
      deletedItem: {
        index: "",
        id: 1,
        name: "",
      },
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

        if (response.data.confirm == true) {
          this.documents = response.data.result;
          this.documentStatuses = response.data.documentStatuses;
          console.log(this.documentStatuses);
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    async postData(data) {
      try {
        const response = await APIUPLOAD("addDocumentsData", data);

        if (response.data.confirm == true) {
          this.getData();
          this.showServerResponse();
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    updateItem(dialogType, item) {
      this.dialogType = dialogType;
      if (dialogType !== "download") {
        this.itemDialog = true;
        this.editedItem = item;
        this.editedItem.eventType = dialogType;
      }
    },
    async saveItem(eventType, editedItem) {
      switch (eventType) {
        case "save":
          try {
            const response = await APIPOST2("updateDocumentsData", editedItem);
            if (response.data.confirmUpdateDocumentData == true) {
              this.itemDialog = false;
              this.showServerResponse();
            } else {
              const error = response.data;
              this.showServerError(error);
            }
          } catch (error) {
            this.showCatchError(error);
          }
          break;
        case "delete":
          try {
            const response = await APIPOST2("updateDocumentsData", editedItem);
            if (response.data.confirmUpdateDocumentData == true) {
              this.itemDialog = false;
              this.showServerResponse();

              this.documents = this.documents.filter(
                (document) => document.id !== editedItem.id
              );
            } else {
              const error = response.data;
              this.showServerError(error);
            }
          } catch (error) {
            this.showCatchError(error);
          }
          break;
        case "confirm":
          try {
            const response = await APIPOST2("updateDocumentsData", editedItem);
            if (response.data.confirmUpdateDocumentData == true) {
              const newStatusId = response.data.statusId;
              const newStatusData = this.documentStatuses.find(
                (status) => status.id == newStatusId
              );
              const newStatus = newStatusData.name;

              this.itemDialog = false;
              this.showServerResponse();

              this.documents = this.documents.map((document) => {
                if (document.id === editedItem.id) {
                  return {
                    ...document,
                    statusId: newStatusId,
                    status: newStatus,
                  };
                } else {
                  return document;
                }
              });
            } else {
              const error = response.data;
              this.showServerError(error);
            }
          } catch (error) {
            this.showCatchError(error);
          }
      }
    },
    closeDialog() {
      this.itemDialog = false;
      this.uploadDialog = false;
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
      this.checkError(error, {
        show: true,
        title: "Hiba",
        message: `Hiba történt az adatok lekérése közben: ${error}`,
        options: [],
        type: {
          action: "error",
        },
      });
    },
    showCatchError(error) {
      this.checkError(error, {
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


<style scoped>
.my-table >>> tr:hover {
  background-color: #359756 !important;
}
</style>
