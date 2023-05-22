<template>
    <v-container fluid>
        <v-row>
            <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
            <DialogFieldVue :itemDialog="itemDialog" :dialogType="dialogType" :editedItem="editedItem" @delete="deleteItem"
                @close="closeDialog" />
            <UploadFile :uploadDialog="uploadDialog" @save="saveUploadedItem" @close="closeDialog"></UploadFile>
            <v-col class="col-12 col-md-6 col-lg-6 col-xl-6">
                <!-- Új bejelentés -->
                <template>
                    <v-card class="sticky-top">
                        <v-banner two-line>
                            <v-avatar slot="icon" color="yellow" size="40">
                                <v-icon icon="mdi-alert-outline" color="black">
                                    mdi-alert-outline
                                </v-icon>
                            </v-avatar>
                            Társasházat érintő hiba, felújítási vagy karbantartási igény bejelentése a társasházat kezelő felé.
                        </v-banner>
                        <v-card-title>Új bejelentés</v-card-title>
                        <v-card-text>
                            <div>
                                <div class="v-form-group">
                                    <v-text-field type="text" :placeholder="'Cím'" color="#359756"></v-text-field>
                                </div>
                                <div class="v-form-group">
                                    <v-textarea solo name="input-7-4" label="Bejelentés szövege"></v-textarea>
                                </div>
                                <div class="file-upload claim">
                                    <label for="fileInput" class="upload-icon-label">
                                        <v-icon size="20" color="#359756" class="">
                                            mdi-cloud-upload
                                        </v-icon>
                                        Fénykép kiválasztása
                                    </label>
                                    <input type="file" id="fileInput" ref="fileInput" class="upload-input"
                                        @change="onFileInputChange" hidden>
                                </div>
                                <img :src="selectedFilePath" alt="Selected Image" v-if="selectedFilePath"
                                    class="selected-picture" height="100">
                            </div>
                            <v-btn type="submit" color="#359756">Küldés</v-btn>
                        </v-card-text>
                    </v-card>
                </template>
            </v-col>
            <v-col class="col-12 col-md-6 col-lg-6 col-xl-6">
                <!-- Filter -->
                <template>
                    <v-card class="mb-4 pa-4">
                        <v-row>
                            <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <v-text-field label="Keresés" v-model="search" color="#359756" />
                            </v-col>
                            <v-col class="pa-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <v-select color="#359756" v-model="filterStatus" :items="statuses" item-text="name"
                                    item-value="id" label="Státusz">
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-card>
                </template>
                <!-- Statements -->
                <template>
                    <v-card v-for="(statement, index) in filteredStatements" :key="index" :id="statement.id"
                        class="mb-4 pa-4">
                        <v-layout justify-space-between align-center>
                            <v-card-title>{{ statement.title }}
                            </v-card-title>
                            <p class="font-italic subtitle-2 ma-0">
                                {{ getStatusName(statement.status) }}
                                <v-icon size="30" :color=getStatusColor(statement.status)>mdi-circle-small</v-icon>
                            </p>
                        </v-layout>
                        <v-card-text>{{ statement.description }}</v-card-text>
                        <v-expansion-panels>
                            <v-expansion-panel class="mb-4">
                                <v-expansion-panel-header>
                                    <v-card-text class="pa-0">Fotók</v-card-text>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-card v-if="statement.images" class="mt-2">
                                        <template>
                                            <v-row class="mb-2 mt-2 pa-2">
                                                <v-col xs="12" sm="4" v-for="(image, index) in statement.images"
                                                    :key="index">
                                                    <a :href="image.url">
                                                        <v-img :src=image.url>
                                                            <v-icon size="30" class="trash-photo" color="red"
                                                                @click="openDialog('delete', index)"
                                                                @click.prevent>mdi-trash-can-outline</v-icon>
                                                        </v-img>
                                                    </a>
                                                </v-col>
                                                <v-col xs="12" sm="4" class="text-center file-upload">
                                                    <v-icon size="50" color="#359756"
                                                        @click="openDialog('uploadPhoto', index)">
                                                        mdi-cloud-upload
                                                    </v-icon>
                                                </v-col>
                                            </v-row>
                                        </template>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel class="mb-4">
                                <v-expansion-panel-header>
                                    <v-card-text class="pa-0">Dokumentumok</v-card-text>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-card v-if="statement.documents" class="mt-2">
                                        <template>
                                            <v-row class="mb-2 mt-2 pa-2">
                                                <v-col xs="12" sm="6" v-for="(documents, index) in statement.documents"
                                                    :key="index" class="text-center justify-center align-center">
                                                    <a :href="documents.url" target="_blank" color="#359756">
                                                        <v-icon size="50" color="#359756">
                                                            mdi-file-pdf-box
                                                        </v-icon>
                                                    </a>
                                                    <v-icon size="25" class="trash-doc" @click="openDialog('delete', index)"
                                                        @click.prevent>mdi-trash-can-outline</v-icon>
                                                    <v-card-text>{{ documents.title }}</v-card-text>
                                                </v-col>
                                                <v-col xs="12" sm="4" class="text-center file-upload">
                                                    <v-icon size="50" color="#359756"
                                                        @click="openDialog('uploadFile', index)">
                                                        mdi-cloud-upload
                                                    </v-icon>
                                                </v-col>
                                            </v-row>
                                        </template>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <v-layout justify-space-between align-center>
                            <p class="font-italic subtitle-2 ma-0">
                                {{ statement.cretedBy }}
                            </p>
                            <p class="font-italic subtitle-2 ma-0">
                                {{ statement.createdAt }}
                            </p>
                        </v-layout>
                    </v-card>
                </template>
            </v-col>
        </v-row>
    </v-container>
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
    data: () => ({
        uploadDialog: false,
        showAlert: false,
        alertMessage: '',
        alertType: '',
        itemDialog: false,
        dialogType: '',
        editedItem: {},
        selectedFilePath: null,
        search: '',
        statuses: [
            { id: 0, name: "mind" },
            { id: 1, name: "nyitott", color: 'red' },
            { id: 2, name: "folyamatban", color: 'yellow' },
            { id: 3, name: "lezárt", color: 'green' },
        ],
        filterStatus: '',
        statements: [
            {
                id: 1,
                title: "title",
                description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis veritatis eveniet fugiat eum nulla sunt explicabo neque ullam debitis ad, officia, quo, eos nesciunt iste deserunt ipsam sint. Quam, est? Delectus assumenda mollitia deleniti ex minus libero, facilis neque corrupti ipsum quasi rem culpa soluta sunt ullam eos architecto iusto magni officiis consequatur cum error? Quaerat error iure voluptate eveniet tenetur voluptatem minima accusamus reiciendis soluta adipisci provident exercitationem velit sint ipsa, fugiat tempore impedit officia. Quod quibusdam animi corrupti ducimus consequuntur id vitae expedita tempora doloremque consectetur, ex mollitia consequatur officia sunt ipsa ut veniam ipsum enim quos magni?",
                images: [
                    {
                        id: 1,
                        url: "https://picsum.photos/200?random=1"
                    },
                    {
                        id: 2,
                        url: "https://picsum.photos/200?random=2"
                    }
                ],
                status: 1,
                documents: [
                    {
                        id: 1,
                        title: "document 1",
                        url: "https://www.buds.com.ua/images/Lorem_ipsum.pdf"
                    },
                    {
                        id: 2,
                        title: "document 2",
                        url: "https://www.buds.com.ua/images/Lorem_ipsum.pdf"
                    }
                ],
                createdAt: '2023-01-01',
                cretedBy: 'John Doe',
            },
            {
                id: 2,
                title: "title2",
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, vero qui. Quas libero repellat ipsum aliquid magni officiis ratione, architecto non aspernatur quod quo minus nulla tempora voluptates aut quam.",
                images: [
                    {
                        id: 3,
                        url: "https://picsum.photos/200?random=1"
                    },
                    {
                        id: 4,
                        url: "https://picsum.photos/200?random=2"
                    }
                ],
                status: 2,
                documents: [
                    {
                        id: 3,
                        title: "document 3",
                        url: "https://www.buds.com.ua/images/Lorem_ipsum.pdf"
                    },
                    {
                        id: 4,
                        title: "document 4",
                        url: "https://www.buds.com.ua/images/Lorem_ipsum.pdf"
                    }
                ],
                createdAt: '2023-01-01',
                cretedBy: 'John Doe',
            },
        ],
    }),
    computed: {
        filteredStatements() {
            var filterStatus = '';
            if (this.filterStatus instanceof Object) {
                filterStatus = this.filterStatus.id;
            } else {
                filterStatus = this.filterStatus
            }
            // Az állítások szűrése a search és filterStatus alapján
            return this.statements.filter(statement => {
                // Ellenőrizzük, hogy a search változó definiált-e
                if (this.search || filterStatus) {
                    // A title és description mezőkre is szűrünk
                    const status = statement.status;
                    const title = statement.title.toLowerCase();
                    const description = statement.description.toLowerCase();
                    const search = this.search.toLowerCase();
                    if (filterStatus === 0 && (title.includes(search) || description.includes(search))) {
                        return true;
                    }
                    else if ((title.includes(search) || description.includes(search)) && status === filterStatus) {
                        return true;
                    }
                } else {
                    return true;
                }
            });
        }
    },
    methods: {
        onFileInputChange(event) {
            // Kiválasztott fájl elérési útjának beállítása a data-ban
            const file = event.target.files[0];
            this.selectedFilePath = URL.createObjectURL(file);
        },
        openFileInput() {
            // "input" elem kattintásának szimulálása az "mdi-cloud-upload" ikonra kattintva
            this.$refs.fileInput.click();
        },
        filterStatements() {
            // A szűrt állítások frissítése
        },
        openDialog(dialogType, index) {
            this.dialogType = dialogType;
            if (dialogType === 'edit' || dialogType === 'delete') {
                this.itemDialog = true;
                this.editedItem = Object.assign({}, this.statements[index]);
            } else if (dialogType === 'uploadPhoto' || dialogType === 'uploadFile') {
                this.uploadDialog = true;
            }
        },
        deleteItem() {
            // implement delete logic here
            this.itemDialog = false;
        },
        closeDialog() {
            this.itemDialog = false;
            this.uploadDialog = false;
        },
        saveUploadedItem(item) {
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
        getStatusName(status) {
            return this.statuses.find((s) => s.id === status)?.name || "unknown";
        },
        getStatusColor(status) {
            return this.statuses.find((s) => s.id === status)?.color || "unknown";
        },
    },
    created() {
        // Alapértelmezett érték beállítása
        this.filterStatus = { id: 1, name: "nyitott" }; // Az adatot beállítjuk az alapértelmezett értékkel
    }
}
</script>

<style scoped>
.v-application a {
    color: #359756;
}

.text-center {
    position: relative;
}

.file-upload {
    margin: auto;
}

i:hover {
    cursor: pointer;
}

.file-upload.claim,
.selected-picture {
    margin-bottom: 20px;
}

img.selected-picture {
    border-radius: 30px;
    opacity: 0.8;
}

.trash-photo {
    position: absolute;
    bottom: 0px;
    right: 0px;
    color: black;
    opacity: 0.6;
}

.trash-doc {
    font-size: 25px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0px;
    color: black;
}

.v-expansion-panel-header {
    background-color: #359756;
}

.sticky-top {
    position: sticky !important;
    top: 60px !important;
}
</style>