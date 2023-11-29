<template>
  <v-container class="lighten-5" style="height: 100vh; overflow: auto">
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
    <FieldsNewAccount
      :newAccount="isModalOpen"
      @close="closeModal"
      @save="save"
    ></FieldsNewAccount>
    <v-btn class="mb-4" @click="openModal">Új névjegy</v-btn>
    <v-btn
      class="mb-4"
      :style="{ 'background-color': buttonColor }"
      @click="toggleFilter"
      >{{ accountsScope }}</v-btn
    >
    <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
    <v-row>
      <v-col
        v-for="(account, index) in filteredAccounts"
        :key="index"
        cols="12"
        md="4"
        lg="4"
        sm="12"
      >
        <v-card class="mx-auto" max-width="344">
          <v-card-text>
            <p class="text-h5 text--primary" style="position: relative">
              {{ account.lastName + " " + account.firstName }}
              <v-icon
                v-if="!account.saveButton"
                @click="
                  (account.edit = !account.edit),
                    (account.saveButton = !account.saveButton)
                "
                >mdi-pencil</v-icon
              >
              <v-icon
                v-if="account.edit"
                @click="
                  (account.saveButton = !account.saveButton),
                    (account.edit = !account.edit),
                    update(account, index)
                "
                >mdi-check</v-icon
              >
            </p>
            <p v-if="account.professionalField">
              {{ account.professionalField }}
            </p>
            <div class="text--primary">
              <v-text-field
                prepend-icon="mdi-cellphone"
                v-model="account.phoneNumber"
                :filled="!account.edit"
                :readonly="!account.edit"
                color="#359756"
                :value="account.phoneNumber"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-email"
                v-model="account.email"
                :filled="!account.edit"
                :readonly="!account.edit"
                color="#359756"
                :value="account.email"
              ></v-text-field>
              <v-chip
                v-if="account.resident"
                class="ma-2"
                color="#359756"
                text-color="white"
              >
                <v-avatar left>
                  <v-icon>mdi-office-building-outline</v-icon>
                </v-avatar>
                <strong>{{ account.stairCase }}</strong
                >&nbsp;
                <span>lépcsőház</span>
              </v-chip>
              <v-chip
                v-if="account.resident"
                class="ma-2"
                color="#359756"
                text-color="white"
              >
                <v-avatar left>
                  <v-icon>mdi-home-account</v-icon>
                </v-avatar>
                <strong>{{ account.flat }}</strong
                >&nbsp;
                <span>lakás</span>
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { APIGET, APIPOST, APIUPLOAD } from "~/api/apiHelper";

export default {
  data() {
    return {
      accounts: [],
      isModalOpen: false,
      showAlert: false,
      alertMessage: "",
      alertType: "",
      userData: null,
      buttonColor: "", // Kezdeti szín
      isFilterActive: false,
      filteredAccounts: [],
      accountsScope: 'Lakók'
    };
  },
  async fetch() {
    // Itt végezheted az adatlekérdezést
    const dataFromLocalStorage = localStorage.getItem("apiLogin");
    const parsedData = JSON.parse(dataFromLocalStorage);

    this.userData = parsedData;
    try {
      const response = await APIPOST("getAccountsData", this.userData);
      var error = "";
      if (!response.data.error) {
        response.data.forEach((item, index) => {
          this.accounts.push({
            ...this.accounts[index],
            id: item.id,
            lastName: item.lastName,
            firstName: item.firstName,
            phoneNumber: item.phoneNumber,
            email: item.email,
            stairCase: item.stairCase,
            flat: item.flat,
            resident: item.resident,
            professionalField: item.professionalField,
            edit: false,
            saveButton: false,
          });
        });
        this.filteredAccounts = this.accounts;
        this.toggleFilter();
      }
    } catch (error) {
      this.checkError(error, {
        show: true,
        title: "Hiba",
        message: "Hiba történt az adatok lekérése közben: " + error,
        options: [],
        type: {
          action: "error",
        },
      });
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true; // Modális ablak megnyitása
    },
    closeModal() {
      this.isModalOpen = false; // Modális ablak megnyitása
    },
    async save(data) {
      try {
        const response = await APIPOST("addAccountsData", data);

        if (response.data.confirmAddNewAccount == true) {
          this.accounts.unshift(data);
        }
      } catch (error) {
        console.log(error);
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
    async update(data, index) {
      console.log(data, index);
      try {
        const response = await APIPOST("updateAccountsData", data);

        if (response.data.confirmUpdateAccountData == true) {
          this.accounts[index] = data;
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
        console.log(error);
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
    toggleFilter() {
      this.isFilterActive = !this.isFilterActive;

      if (this.isFilterActive) {
        this.accountsScope = 'Lakók';
        this.filteredAccounts = this.accounts.filter(account => !account.professionalField);
        this.buttonColor = '#359756';
      } else {
        // Ha a szűrés kikapcsolva van, akkor visszaállítjuk az eredeti adatokat
        this.filteredAccounts = this.accounts;
        this.buttonColor = ''; // Üres string a szín eltávolításához
        this.accountsScope = 'Összes';
      }
    },
  },
};
</script>

<style scoped>
button.mdi-pencil,
button.mdi-check {
  position: absolute;
  top: 10%;
  right: 0%;
}
i.mdi-pencil:hover {
  cursor: pointer;
}
</style>