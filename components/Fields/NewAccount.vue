<template>
  <div justify="center">
    <v-dialog
      v-if="newAccount"
      v-model="newAccount"
      @click:outside="closeDialog()"
      max-width="350"
    >
      <v-card>
        <v-form class="pa-4" ref="form" @submit.prevent="onSubmit">
          <v-card-title class="text-h5"> Új névjegy </v-card-title>
          <v-text-field
            label="Vezetéknév"
            prepend-icon="mdi-account-box"
            color="#359756"
            v-model="newAccountData.lastName"
            :rules="firstNameRule"
          ></v-text-field>
          <v-text-field
            label="Keresztnév"
            prepend-icon="mdi-account-box"
            color="#359756"
            v-model="newAccountData.firstName"
            :rules="lastNameRule"
          ></v-text-field>
          <v-text-field
            label="Telefonszám"
            prepend-icon="mdi-cellphone"
            color="#359756"
            v-model="newAccountData.phoneNumber"
            :rules="phoneNumberRule"
          ></v-text-field>
          <v-text-field
            label="email"
            prepend-icon="mdi-email"
            color="#359756"
            v-model="newAccountData.email"
            :rules="emailRule"
          >
          </v-text-field>
          <v-checkbox
            v-model="newAccountData.resident"
            label="Lakó"
            color="success"
            :value="newAccountData.resident"
            hide-details
          ></v-checkbox>
          <v-text-field
            v-if="newAccountData.resident"
            label="Lépcsőház"
            prepend-icon="mdi-office-building-outline"
            color="#359756"
            v-model="newAccountData.stairCase"
            :rules="stairCaseRule"
          ></v-text-field>
          <v-text-field
            v-if="newAccountData.resident"
            label="Lakás"
            prepend-icon="mdi-home"
            color="#359756"
            v-model="newAccountData.flat"
            :rules="flatRule"
          ></v-text-field>
          <v-text-field
            v-if="!newAccountData.resident"
            label="Szakipar"
            prepend-icon="mdi-home"
            color="#359756"
            v-model="newAccountData.professionalField"
            :rules="professionalFieldRule"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog()"> Mégsem </v-btn>
            <v-btn type="submit" color="#359756"> Mentés </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "NewAccount",
  props: {
    newAccount: Boolean, // A newAccount prop típusának definiálása
  },
  data() {
    return {
      newAccountData: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        stairCase: null,
        flat: null,
        resident: null,
        professionalField: "",
      },
      firstNameRule: [(v) => !!v || "Kötelező kitölteni"],
      lastNameRule: [(v) => !!v || "Kötelező kitölteni"],
      phoneNumberRule: [(v) => !!v || "Kötelező kitölteni"],
      emailRule: [(v) => !!v || "Kötelező kitölteni"],
      stairCaseRule: [(v) => !!v || "Kötelező kitölteni"],
      flatRule: [(v) => !!v || "Kötelező kitölteni"],
      professionalFieldRule: [(v) => !!v || "Kötelező kitölteni"],
    };
  },
  computed: {
    //
  },
  methods: {
    async onSubmit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      }
      const data = this.newAccountData;
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