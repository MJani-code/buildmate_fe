<template>
    <v-card>
        <UploadField></UploadField>
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
        <DialogFieldVue :dialog="dialog" :dialogType="dialogType" :editedItem="editedItem" @save="saveItem"
            @delete="deleteItem" @close="closeDialog" />
    </v-card>
</template>


<script>
import DialogFieldVue from '../../components/Fields/DialogField.vue';
import UploadField from '../../components/Fields/UploadField.vue';

export default {
    components: {
        DialogFieldVue,
        UploadField
    },
    data() {
        return {
            dialog: false,
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
            this.dialog = true;
            this.dialogType = dialogType;
            if(this.dialogType === 'edit'){
                this.editedItem = Object.assign({}, this.documents[index]);
            }
        },
        saveItem() {
            // implement save logic here
            this.dialog = false;
            console.log(this.editedItem.name);
        },
        deleteItem() {
            // implement delete logic here
            this.dialog = false;
        },
        closeDialog() {
            this.dialog = false;
        },
    },
};
</script>


<style scoped>
.my-table>>>tr:hover {
    background-color: #359756 !important;
}
</style>