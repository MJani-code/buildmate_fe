<template>
    <v-container class="lighten-5">
        <v-row no-gutters>
            <v-col xs="12" sm="12" md="6" lg="6" xl="6" class="col">
                <v-card class="pa-2"
                    :class="{ 'create-poll-bg-dark': $vuetify.theme.dark, 'create-poll-bg-light': !$vuetify.theme.dark }"
                    outlined tile>
                    <v-card-title>Szavazás létrehozása</v-card-title>
                    <template>
                        <v-card-text>
                            <v-form>
                                <div v-for="(query, index) in queries" :key="index">
                                    <div class="v-form-group">
                                        <v-text-field type="text" v-model="query.question"
                                            :placeholder="'Ide írd a kérdést'" color="#359756"></v-text-field>
                                    </div>
                                    <div class="v-form-group" v-for="(choice, choiceIndex) in query.choices"
                                        :key="choiceIndex">
                                        <v-text-field type="text" v-model="query.choices[choiceIndex]"
                                            :placeholder="'Válasz ' + (choiceIndex + 1)" color="#359756">
                                            <template #append>
                                                <v-icon class="icon-text-field-icon"
                                                    @click="addChoice(query.choices)">mdi-plus</v-icon>
                                                <v-icon class="icon-text-field-icon" v-if="choiceIndex > 0"
                                                    @click="removeChoice(query.choices, choiceIndex)">mdi-trash-can-outline</v-icon>
                                            </template>
                                        </v-text-field>
                                    </div>
                                    <v-text-field label="Határidő" type="datetime-local" color="#359756" />
                                    <v-checkbox style="width: fit-content;" label="Több válasz engedélyezése"
                                        color="#359756">
                                    </v-checkbox>
                                    <div style="display: block; margin-bottom: 20px;">
                                        <v-btn style="width: 100%;" :color="'error'" class="danger" v-if="index > 0"
                                            @click="removequery(index)">Kérdés eltávolítása</v-btn>
                                    </div>
                                </div>
                                <v-divider class="my-divider"></v-divider>
                                <div style="display: block; margin: 20px 20px;">
                                    <v-btn style="width: 100%;" @click="addquery">Új kérdés hozzáadása</v-btn>
                                </div>
                                <div style="display: block; margin: 20px 20px;">
                                    <v-btn type="submit" style="width: 100%;" color="#359756">Szavazás indítása</v-btn>
                                </div>
                            </v-form>
                        </v-card-text>
                    </template>
                </v-card>
            </v-col>
            <v-col xs="12" sm="12" md="6" lg="6" xl="6">
                <v-row no-gutters>
                    <v-col cols="12">
                        <v-card class="ml-2 no-border" outlined tile>
                            <PollField></PollField>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card class="ml-2 no-border" outlined tile>
                            <v-card-title>Szavazás eredménye</v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>

import PollField from '../../components/Fields/PollField.vue';

export default {
    data: () => ({
        queries: [
            { question: '', selected: '', multiple: false, choices: [''] }
        ]
    }),
    components: {
        PollField,
    },
    methods: {
        addChoice(choices) {
            choices.push('');
        },
        removeChoice(choices, index) {
            choices.splice(index, 1);
        },
        addquery() {
            this.queries.push({
                question: '',
                selected: '',
                multiple: false,
                choices: ['', '']
            });
            console.log(this)
        },
        removequery(index) {
            this.queries.splice(index, 1);
        }
    }
};
</script>

<style scoped>
.no-border {
    border: none !important;
}
</style>