<template>
  <v-container class="lighten-5" style="height: 100vh; overflow: auto">
    <FieldsNewAccount
      :newAccount="isModalOpen"
      @close="closeModal"
      @save="save"
    ></FieldsNewAccount>
    <v-btn class="mb-4" @click="openModal">Új névjegy</v-btn>
    <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
    <v-row>
      <v-col
        v-for="(account, index) in accounts"
        :key="index"
        cols="12"
        md="4"
        lg="4"
        sm="12"
      >
        <v-card class="mx-auto" max-width="344">
          <v-card-text>
            <p class="text-h4 text--primary">
              {{ account.lastName + " " + account.firstName }}
            </p>
            <p v-if="account.professionalField">
              {{ account.professionalField }}
            </p>
            <div class="text--primary">
              <v-text-field
                prepend-icon="mdi-cellphone"
                filled
                readonly
                color="#359756"
                :value="account.phoneNumber"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-email"
                filled
                readonly
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
    };
  },
  async fetch() {
    // Itt végezheted az adatlekérdezést
    try {
      const response = await APIGET("getAccountsData");
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
          });
        });
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
  },
};
</script>