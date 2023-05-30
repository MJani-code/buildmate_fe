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
            <v-text-field v-model="bankData.accountNumber" :rules="[letterRule, cardNumberRule]" @input="formatCardNumber"
                label="Bankszámlaszám" class="input-group" color="#359756" required>
            </v-text-field>
        </v-col>
        <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <v-text-field ref="amount" v-model="bankData.amount" :rules="[letterRule, formatAmountRule]"
                @input="formatAmountValue" label="Utalandó összeg" class="input-group" color="#359756" required>
            </v-text-field>
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
                amount: ''
            },
            nameRule: [v => !!v || 'Kötelező kitölteni'],
            cardNumberRule: (v) => /^\d{8}-\d{8}-\d{8}$/.test(v) || 'Érvénytelen bankszámlaszám',
            letterRule: (v) => {
                const hasLetter = /[a-zA-Z]/.test(v);
                if (hasLetter && this.bankData.accountNumber !== null) {
                    this.bankData.accountNumber.slice(0, -1);
                    v.slice(0, -1);
                }
                return !hasLetter || 'Csak számokat lehet beírni';
            },
            formatAmountRule: (v) => {
                return !isNaN(parseFloat(v));
            },
        };
    },
    computed: {
        //
    },
    watch: {
        //
    },
    methods: {
        formatCardNumber() {
            if (this.bankData.accountNumber) {
                this.bankData.accountNumber = this.bankData.accountNumber.replace(/\D/g, '');
                const parts = this.bankData.accountNumber.match(/.{1,8}/g);
                if (parts) {
                    this.bankData.accountNumber = parts.join('-');
                }
            }
        },
        formatAmountValue() {
            const formattedValue = this.formatAmount(this.bankData.amount);
            this.bankData.amount = formattedValue;
        },
        formatAmount(value) {
            if (value === null || value === "") {
                return value;
            }
            const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
            if (isNaN(numericValue)) { // Ellenőrizd, hogy a numericValue NaN-e
                return ""; // Vagy a kívánt alapértelmezett értéket adhatod vissza
            }
            const formattedValue = new Intl.NumberFormat("hu-HU").format(numericValue);
            return formattedValue;
        },


    }
}

</script>

<style scoped></style>