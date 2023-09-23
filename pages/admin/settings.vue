<template>
  <v-container fluid>
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="4">
        <template>
          <v-card class="">
            <v-card-title class="profile-title"
              >Felhasználói profil</v-card-title
            >
            <v-card-text>
              <v-form ref="form" @submit.prevent="onSubmit">
                <v-row>
                  <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <v-text-field
                      :clearable="editMode"
                      color="#359756"
                      v-model="user.lastName"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Vezetéknév"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <v-text-field
                      :clearable="editMode"
                      color="#359756"
                      v-model="user.firstName"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Keresztnév"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="6" xl="6">
                    <v-text-field
                      :clearable="editMode"
                      color="#359756"
                      v-model="user.email"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="E-mail"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="6" xl="6" v-if="editMode">
                    <v-text-field
                      :clearable="editMode"
                      type="password"
                      color="#359756"
                      v-model="user.password"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Jelszó"
                      :rules="passwordRule"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="6" xl="6" v-if="editMode">
                    <v-text-field
                      :clearable="editMode"
                      type="password"
                      color="#359756"
                      v-model="user.newPassword"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Új jelszó"
                      :rules="newPasswordRule"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="6" xl="6" v-if="editMode">
                    <v-text-field
                      :clearable="editMode"
                      type="password"
                      color="#359756"
                      v-model="user.newPasswordConfirm"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Új jelszó ismét"
                      :rules="newPasswordConfirmRule"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="6" lg="5" xl="6" class="col-xs-8">
                    <v-text-field
                      :clearable="editMode"
                      color="#359756"
                      v-model="user.phoneNumber"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Telefonszám"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="3" md="6" lg="4" xl="3">
                    <v-text-field
                      :clearable="editMode"
                      color="#359756"
                      v-model="user.stairCase"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Lépcsőház"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="3" md="6" lg="3" xl="3">
                    <v-text-field
                      :clearable="editMode"
                      color="#359756"
                      v-model="user.flat"
                      :readonly="!editMode"
                      :filled="!editMode"
                      label="Lakás"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn
                    v-if="editMode"
                    @click="editMode = !editMode"
                    class="ma-3"
                    >Mégsem</v-btn
                  >
                  <v-btn
                    v-if="editMode"
                    type="submit"
                    color="#359756"
                    class="ma-3"
                    >Profil mentése</v-btn
                  >
                </v-card-actions>
              </v-form>
              <v-btn v-if="!editMode" @click="editMode = !editMode" class="ma-3"
                >Szerkesztés</v-btn
              >
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { APIGET, APIPOST, APIUPLOAD } from "~/api/apiHelper";
import Alert from "../../components/Alert.vue";

export default {
  components: {
    Alert,
  },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        newPassword: "",
        newPasswordConfirm: "",
        stairCase: "",
        flat: "",
      },
      editMode: false,
      showAlert: false,
      alertMessage: "",
      alertType: "",
      passwordRule: [(v) => !!v || "A módosításhoz szükséges a jelenlegi jelszavad!"]
    };
  },
  computed: {
    newPasswordRule() {
      return [
        (v) =>
          !v ||
          /[A-Z]/.test(v) ||
          "A jelszónak legalább egy nagybetűt kell tartalmaznia",
        (v) =>
          !v ||
          /[0-9]/.test(v) ||
          "A jelszónak legalább egy számot kell tartalmaznia",
        (v) =>
          !v ||
          v.length >= 8 ||
          "A jelszónak legalább 8 karakter hosszúnak kell lennie",
      ];
    },
    newPasswordConfirmRule() {
      return [
        (v) => v === this.user.newPassword || "A jelszavak nem egyeznek meg",
      ];
    },
  },
  mounted() {
    // Profiladatok lekérdezése
    this.fetchProfileData();
  },
  methods: {
    async fetchProfileData() {
      const dataFromLocalStorage = localStorage.getItem("apiLogin");
      const parsedData = JSON.parse(dataFromLocalStorage);

      // TODO implementálni a profiladatok lekérésének logikáját (pl. API hívás)
      // A profiladatokat a `user` adat tulajdonságba mentheted
      try {
        const response = await APIPOST("getUserData", parsedData);
        const jsonData = JSON.stringify(response.data);

        this.user = {
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
          phoneNumber: response.data.phonenumber,
          stairCase: response.data.stair_case,
          flat: response.data.flat,
        };
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
    async onSubmit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      } else {
        this.saveProfile();
      }
    },
    async saveProfile() {
      // Felhasználói profil mentése
      //TODO implementálni a validálási és mentési logikát a profil mentésére (pl. API hívás)
      const response = await APIPOST("updateUserData", this.user);

      if (response.data.confirmUpdateUserData == true) {
        this.alertMessage = "A mentés sikeres volt!";
        this.alertType = "success";
        this.showAlert = true;
        if ((this.showAlert = true)) {
          setTimeout(() => {
            this.showAlert = false; // Az értesítés elrejtése
          }, 3000);
        }
      } else {
        this.$root.$store.dispatch("setResponseHandler", {
          show: true,
          title: "Hiba",
          message: response.data.error,
          options: [],
          type: {
            action: "error",
          },
        });
      }

      this.editMode = false;
    },
    //TODO mégse gombra kattintva vissza kell állítani az eredeti bevitt adatokat
  },
};
</script>

<style scoped>
.profile {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
