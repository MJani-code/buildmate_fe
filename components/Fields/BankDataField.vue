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
                <v-text-field v-model="bankData.accountNumber" label="Bankszámlaszám" class="input-group" color="#359756" required
                    >
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
            bankData:{
                firstName: '',
                lastName: '',
                accountNumber: null,
            },
            nameRule: [v => !!v || 'Kötelező kitölteni'],

        };
    },
    computed: {
        //
    },
    methods: {
        //
    }
}

</script>

<style scoped></style>