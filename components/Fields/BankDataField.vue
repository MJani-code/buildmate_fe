<template>
    <v-row v-if="bankDataField">
        <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <v-text-field v-model="bankData.lastName" label="Vezetéknév" class="input-group" color="#359756" required
                :rules="nameRule">
            </v-text-field>
        </v-col>
        <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <v-text-field v-model="bankData.firstName" label="Keresztnév" class="input-group" color="#359756" required
                :rules="nameRule">
            </v-text-field>
        </v-col>
        <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <v-text-field v-model="bankData.accountNumber" :error-messages="errorMessages" label="Bankszámlaszám"
                class="input-group" color="#359756" required>
            </v-text-field>
        </v-col>
        <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">

        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "BankDataField",
    props: {
        bankDataField: Boolean,
    },
    data() {
        return {
            bankData: {
                firstName: '',
                lastName: '',
                accountNumber: null,
            },
            nameRule: [v => !!v || 'Kötelező kitölteni'],
            error: '',
        };
    },
    computed: {
        errorMessages() {
            return this.error ? [this.error] : '';
        },
    },
    watch: {
        'bankData.accountNumber': function (newVal) {
            this.validateAccountNumber(newVal);
        },
    },
    methods: {
        validateAccountNumber(accountNumber) {
            // Bankszámlaszám validáció
            this.error = '';
            const regex = /^\d{8}-\d{8}-\d{8}$/; // Bankszámlaszám formátuma: 12345678-12345678-12345678
            const input = this.bankData.accountNumber;

            if (!input.match(/^[0-9]*$/)) {
                console.log("csak számokat lehet beírni");
                this.error += 'Csak számokat lehet beírni.';
                this.$nextTick(() => {
                    this.bankData.accountNumber = '';
                });
                return false;
            }
            else if (!regex.test(accountNumber)) {
                // Érvénytelen bankszámlaszám formátum
                this.error += 'Érvénytelen bankszámlaszám.';
                return false;
            }
            // Minden validáció sikeres
            this.error = ''; // Nincs hiba, a hibaüzenet üres
            return true;
        },
    }
}

</script>

<style scoped></style>