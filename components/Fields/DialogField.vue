<template>
    <v-dialog :value="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                {{ dialogType === 'edit' ? 'Szerkesztés' : 'Törlés' }}
            </v-card-title>
            <v-card-text>
                {{ dialogType === 'edit' ? '' : 'Biztosan törölni szeretnéd?' }}
                <v-text-field v-if="editedItem.name" v-model="editedItem.name" label="Dokumentum neve"
                    color="#359756"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="closeDialog">Mégsem</v-btn>
                <v-btn :color="dialogType === 'edit' ? '#359756' : 'error'"
                    @click="dialogType === 'edit' ? saveItem() : deleteItem()">
                    {{ dialogType === 'edit' ? 'Mentés' : 'Törlés' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        dialog: Boolean,
        dialogType: String,
        editedItem: Object,
    },
    methods: {
        saveItem() {
            this.$emit('save');
        },
        deleteItem() {
            this.$emit('delete');
        },
        closeDialog() {
            this.$emit('close');
        },
    },
};
</script>
