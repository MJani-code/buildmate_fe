<template>
    <v-card>
        <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Keresés" single-line hide-details
                color="#359756"></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="documents" :search="search" class="my-table">
            <template v-slot:item.actions="{ item, index }">
                <div>
                    <v-btn icon><v-icon size="20">mdi-eye</v-icon></v-btn>
                    <v-btn @click="openDialog('edit', index)" icon><v-icon size="20">mdi-pencil-outline</v-icon></v-btn>
                    <v-btn @click="openDialog('delete', index)" icon><v-icon size="20">mdi-delete-outline</v-icon></v-btn>
                </div>
                <div>
                </div>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="500px">
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
    </v-card>
</template>

<script>

import moment from "moment/moment";

export default {
    name: 'Dokumentum',
    data() {
        return {
            dialog: false,
            dialogType: '',
            editedItem: {
                name: ''
            },
            deletedItem: {
                index: '',
                name: ''
            },
            editedIndex: -1,
            deletedIndex: -1,
            isLoading: false,
            show: false,
            search: '',
            headers: [
                {
                    text: 'Dokumentum neve',
                    align: 'start',
                    filterable: true,
                    value: 'name',
                },
                { text: 'Feltöltés dátuma', value: 'uploadingdate' },
                { text: 'Feltöltötte', value: 'uploadedby' },
                { text: 'Műveletek', align: 'center', value: 'actions' },

            ],
            documents: [
                {
                    name: 'Dokumentum1',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'John Doe',
                    path: '',
                    actions: '',
                },
                {
                    name: 'Dokumentum2',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'Jane Doe',
                    actions: '',
                },
                {
                    name: 'Dokumentum3',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'John Doe',
                    path: '',
                    actions: '',
                },
                {
                    name: 'Dokumentum4',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'John Doe',
                    path: '',
                    actions: '',
                },
                {
                    name: 'Dokumentum5',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'John Doe',
                    path: '',
                    actions: '',
                },
                {
                    name: 'Dokumentum6',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'John Doe',
                    path: '',
                    actions: '',
                },
                {
                    name: 'Dokumentum7',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'John Doe',
                    path: '',
                    actions: '',
                },
                {
                    name: 'Dokumentum8',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'John Doe',
                    path: '',
                    actions: '',
                },
                {
                    name: 'Dokumentum9',
                    uploadingdate: '2023-01-01',
                    uploadedby: 'John Doe',
                    path: '',
                    actions: '',
                },
            ],
        };
    },
    mounted() {
        // Add event listener to modal container element
        document.addEventListener('keydown', this.handleDocumentKeydown)
    },
    beforeDestroy() {
        // Remove event listener when component is destroyed
        document.removeEventListener('keydown', this.handleDocumentKeydown)
    },
    created() {
        //
    },
    computed: {
        //
    },
    watch: {
        //
    },
    methods: {
        formatDate(date) {
            return moment(date.trim(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
        },
        openDialog(type, index) {
            this.dialogType = type;
            this.editedIndex = index;
            this.deletedIndex = index;
            if(this.dialogType === 'edit'){
                this.editedItem = Object.assign({}, this.documents[index]);
            }else{
                this.deletedItem = Object.assign({}, this.documents[index]);
            }
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
            this.dialogType = '';
            this.editedItem.name = '';
        },
        deleteItem() {
            this.documents.splice(this.index, 1);
            this.closeDialog();
        },
        handleEnterKey() {
            if (this.dialog) {
                this.saveItem()
            }
        },
        saveItem() {
            Object.assign(this.documents[this.editedIndex], this.editedItem);
            this.closeDialog();
        },
        handleDocumentKeydown(event) {
            // Check if dialog is open and Enter key is pressed
            if (this.dialog && event.key === 'Enter') {
                event.preventDefault()
            }
        }
    }
}
</script>

<style scoped>
.my-table>>>tr:hover {
    background-color: #359756 !important;
}
</style>