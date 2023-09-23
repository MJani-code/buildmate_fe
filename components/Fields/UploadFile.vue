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
        <v-row v-if="item.type === 1">
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
            <div
              class="p-50 bg-gray-100 border border-gray-300"
              @dragover="dragover"
              @dragleave="dragleave"
              @drop="drop"
            >
              <input
                type="file"
                model="filelist"
                name="assetsFieldHandle"
                id="assetsFieldHandle"
                class="w-px h-px opacity-0 overflow-hidden absolute"
                @change="onChange"
                ref="file"
                accept=".pdf,.jpg,.jpeg,.png"
                :rules="fileRule"
                required
                multiple
              />
              <div>
                Húzd ide a feltölteni kívánt dokumentumot vagy kattints
                <label for="assetsFieldHandle" class="block cursor-pointer">
                  <span class="underline"><a>ide</a></span>
                </label>
              </div>
              <v-row class="mt-4" v-if="item.filelist">
                <div v-for="file in item.filelist">
                  <v-icon size="30" color="#359756"> mdi-file </v-icon>
                  <v-card-text>
                    {{ file.name }}
                    <v-icon
                      class="ml-2"
                      size="20"
                      @click="remove(item.filelist.indexOf(file))"
                    >
                      mdi-close
                    </v-icon>
                  </v-card-text>
                </div>
              </v-row>
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
        { id: 1, typeEng: "invoices", typeHun: "számla" },
        { id: 2, typeEng: "documents", typeHun: "dokumentum" },
        { id: 3, typeEng: "others", typeHun: "egyéb" },
      ],
      item: {
        type_id: null,
        type: "",
        title: "",
        filelist: [],
      },
      selectedItemId: null,
      delimiters: ["${", "}"], // Avoid Twig conflicts
      //filelist: [], // Store our uploaded files
      titleRule: [(v) => !!v || "Kötelező kitölteni"],
      fileRule: [(v) => v.length > 0 || "Dokumentumot csatolni kötelező"],
      bankDataField: false,
    };
  },
  watch: {
    selectedItemId(newId) {
      // Az aktuális id alapján megtaláljuk a megfelelő typeHun értéket

      const selectedType = this.doctypes.find(item => item.id === newId);
      if (selectedType) {
        this.item.type = selectedType.typeEng;
        this.item.type_id = newId;
      }
      console.log(this.item);
    },
  },
  mounted() {
    const dataFromLocalStorage = localStorage.getItem('apiLogin');
    const parsedData = JSON.parse(dataFromLocalStorage);

    this.item.userId = parsedData.userId;
  },
  methods: {
    onChange() {
      const files = this.$refs.file.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.item.filelist.push(file);
      }
    },
    remove(i) {
      this.item.filelist.splice(i, 1);
    },
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains("bg-success")) {
        event.currentTarget.classList.remove("bg-gray-100");
        event.currentTarget.classList.add("bg-success");
      }
    },
    dragleave(event) {
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-success");
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange(); // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-success");
    },
    async onSubmit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      }
      const data = this.item;
      this.$emit("save", data);
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