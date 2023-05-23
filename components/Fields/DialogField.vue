<template>
    <v-dialog :value="itemDialog" max-width="500px" persistent>
        <v-card>
            <v-card-title>
                {{ getCardTitle() }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-if="dialogType === 'edit'" v-model="editedItem.name" label="Dokumentum neve"
                    color="#359756"></v-text-field>
                <v-card-text v-else v-model="editedItem.name">{{ getCardText() }} </v-card-text>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="closeDialog">Mégsem</v-btn>
                <v-btn :color="dialogType === 'delete' ? 'error' : '#359756'"
                    @click="dialogType === 'delete' ? deleteItem() : saveItem()">
                    {{ dialogType === 'delete' ? 'Törlés' : 'Mentés' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        itemDialog: Boolean,
        dialogType: String,
        editedItem: Object,
    },
    methods: {
        getCardTitle(){
            if (this.dialogType === 'edit'){
                return 'Szerkesztés';
            } else if(this.dialogType === 'delete'){
                return 'Törlés';
            } else if (this.dialogType === 'confirm'){
                return 'Megerősítés';
            }
        },
        getCardText(){
            if (this.dialogType === 'edit'){
                return 'Szerkesztés';
            } else if(this.dialogType === 'delete'){
                return 'Biztosan törölni szeretnéd?';
            } else if (this.dialogType === 'confirm'){
                return 'Biztosan végrehajtja a műveletet?';
            }
        },
        saveItem() {
            if (this.dialogType === 'edit'){
                this.$emit('save');
            } else if (this.dialogType === 'confirm'){
                this.$emit('confirm');
            }
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
