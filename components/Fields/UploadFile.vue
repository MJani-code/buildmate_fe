<template>
  <v-dialog
    :value="uploadDialog"
    @click:outside="closeDialog"
    class="dialog-width"
    width="auto"
    max-width="530"
  >
    <v-card class="p-20">
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-row>
          <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <v-text-field
              v-model="item.title"
              label="Dokumentum címe"
              class="input-group"
              color="#359756"
              required
              :rules="titleRule"
            >
            </v-text-field>
          </v-col>
          <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <v-select
              color="#359756"
              v-model="selectedItemId"
              :items="doctypes"
              item-text="typeHun"
              item-value="id"
              label="Típus"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row v-if="selectedItemId == 2">
          <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <v-checkbox
              label="Számlakifizetést kérek"
              color="#359756"
              @click.stop="bankDataField = !bankDataField"
            >
            </v-checkbox>
          </v-col>
        </v-row>
        <BankDataField :bankDataField="bankDataField"></BankDataField>
        <v-row>
          <div
            class="block items-center justify-center text-center"
            style="width: 100%"
          >
            <div class="p-50 border border-gray-300">
              <v-file-input
                v-model="item.filelist"
                show-size
                counter
                multiple
                color="#359756"
                class="w-px h-px overflow-hidden absolute"
                accept=".xlsx,.xls,.docx,.doc,.pdf,.jpg,.jpeg,.png"
                :rules="fileRule"
              ></v-file-input>
            </div>
          </div>
        </v-row>
        <v-card-actions class="mt-10">
          <v-btn @click="closeDialog()">Mégsem</v-btn>
          <v-btn type="submit" color="#359756">Mentés</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import BankDataField from "../../components/Fields/BankDataField.vue";

export default {
  name: "UploadField",
  components: {
    BankDataField,
  },
  props: {
    uploadDialog: Boolean,
  },
  data() {
    return {
      doctypes: [
        { id: 1, typeEng: "documents", typeHun: "dokumentum" },
        { id: 2, typeEng: "invoices", typeHun: "számla" },
        { id: 3, typeEng: "others", typeHun: "egyéb" },
      ],
      item: {
        type_id: null,
        type: "",
        title: "",
        filelist: [],
      },
      selectedItemId: null,
      delimiters: ["${", "}"],
      titleRule: [(v) => !!v || "Kötelező kitölteni"],
      fileRule: [
        (v) => v.length > 0 || "Kötelező fájlt csatolni",
        //TODO kiterjesztés figyelést megvalósítani
      ],
      bankDataField: false,
    };
  },
  watch: {
    selectedItemId(newId) {
      const selectedType = this.doctypes.find((item) => item.id === newId);
      if (selectedType) {
        this.item.type = selectedType.typeEng;
        this.item.type_id = newId;
      }
    },
  },
  mounted() {
    const dataFromLocalStorage = localStorage.getItem("apiLogin");
    const parsedData = JSON.parse(dataFromLocalStorage);

    this.item.userId = parsedData.userId;
    this.item.createdBy = parsedData.lastName + " " + parsedData.firstName;
  },
  methods: {
    async onSubmit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      } else {
        const data = this.item;
        this.$emit("save", data);
      }
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
#assetsFieldHandle {
  display: none;
}

.p-50 {
  padding: 50px !important;
}

.p-20 {
  padding: 20px !important;
}

.bg-gray-100 {
  background-color: rgb(204, 204, 204) !important;
  display: inline-block !important;
}

.bg-success {
  background-color: #359756 !important;
  display: inline-block !important;
}
</style>