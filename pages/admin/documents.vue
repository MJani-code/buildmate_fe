<template>
    <v-card>
        <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
        <UploadFile :uploadDialog="uploadDialog" @save="saveUploadedItem" @close="closeDialog"></UploadFile>
        <v-btn class="ma-10" @click="openUploadDialog">Új dokumentum</v-btn>
        <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Keresés" single-line hide-details
                color="#359756"></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="documents" :search="search" class="my-table">
            <template v-slot:item.actions="{ item, index }">
                <div>
                    <v-btn icon><v-icon size="20">mdi-eye</v-icon></v-btn>
                    <v-btn @click="openDialog('edit', index)" icon><v-icon size="20">mdi-pencil-outline</v-icon></v-btn>
                    <v-btn @click="openDialog('download', index)" icon><v-icon size="20">mdi-download-outline</v-icon></v-btn>
                    <v-btn @click="openDialog('delete', index)" icon><v-icon size="20">mdi-delete-outline</v-icon></v-btn>
                </div>
                <div>
                </div>
            </template>
        </v-data-table>
        <DialogFieldVue :itemDialog="itemDialog" :dialogType="dialogType" :editedItem="editedItem" @save="saveItem"
            @delete="deleteItem" @close="closeDialog" />
    </v-card>
</template>


<script>

import DialogFieldVue from '../../components/Fields/DialogField.vue';
import UploadFile from '../../components/Fields/UploadFile.vue';
import Alert from '../../components/Alert.vue';

export default {
    components: {
        DialogFieldVue,
        UploadFile,
        Alert
    },
    data() {
        return {
            itemDialog: false,
            uploadDialog: false,
            showAlert: false,
            alertMessage: '',
            alertType: '',
            dialogType: '',
            editedItem: {},
            deletedItem: {
                index: '',
                name: ''
            },
            editedIndex: -1,
            deletedIndex: -1,
            isLoading: false,
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
    methods: {
        openDialog(dialogType, index) {
            this.dialogType = dialogType;
            if(dialogType !== 'download'){
                this.itemDialog = true;
                this.editedItem = Object.assign({}, this.documents[index]);
            }
        },
        openUploadDialog() {
            this.uploadDialog = true;
        },
        saveItem() {
            // implement save logic here
            console.log("file is saved");
            this.itemDialog = false;
        },
        deleteItem() {
            // implement delete logic here
            this.itemDialog = false;
        },
        closeDialog() {
            this.itemDialog = false;
            this.uploadDialog = false;
        },
        saveUploadedItem() {
            // implement save logic here
            this.uploadDialog = false;
            // If error

            //If succes
            this.alertMessage = 'A mentés sikeres volt!'
            this.alertType = 'success';
            this.showAlert = true
            if (this.showAlert = true) {
                setTimeout(() => {
                    this.showAlert = false; // Az értesítés elrejtése
                }, 3000);
            }
        },
    },
};
</script>


<style scoped>
.my-table>>>tr:hover {
    background-color: #359756 !important;
}
</style>