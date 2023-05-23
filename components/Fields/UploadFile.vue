<template>
    <v-dialog :value="uploadDialog" @click:outside="closeDialog" class="dialog-width" width="auto">
        <v-card class="p-20">
            <v-form ref="form" @submit.prevent="onSubmit">
                <v-text-field v-model="item.name" label="Dokumentum címe" class="input-group" color="#359756" required
                    :rules="titleRule">
                </v-text-field>
                <!-- TODO: dokumentum típusait itt fel kell venni egy legördülőbe -->
                <div class="block items-center justify-center text-center">
                    <div class="p-50 bg-gray-100 border border-gray-300" @dragover="dragover" @dragleave="dragleave"
                        @drop="drop">
                        <input type="file" model="filelist" name="fields[assetsFieldHandle][]" id="assetsFieldHandle"
                            class="w-px h-px opacity-0 overflow-hidden absolute" @change="onChange" ref="file"
                            accept=".pdf,.jpg,.jpeg,.png" :rules="fileRule" required />
                        <div>
                            Húzd ide a feltölteni kívánt dokumentumot vagy kattints
                            <label for="assetsFieldHandle" class="block cursor-pointer">
                                <span class="underline"><a>ide</a></span>
                            </label>
                        </div>
                        <v-row class="mt-4" v-if="this.filelist.length">
                            <div v-for="file in filelist">
                                <v-icon size="30" color="#359756">
                                    mdi-file
                                </v-icon>
                                <v-card-text>
                                    {{ file.name }}
                                    <v-icon class="ml-2" size="20" @click="remove(filelist.indexOf(file))">
                                        mdi-close
                                    </v-icon>
                                </v-card-text>
                            </div>
                        </v-row>
                    </div>
                </div>
                <v-card-actions class="mt-10">
                    <v-btn @click="closeDialog()">Mégsem</v-btn>
                    <v-btn type="submit" color="#359756">Mentés</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "UploadField",
    props: {
        uploadDialog: Boolean,
        item: {
            type: Object,
            default: () => ({ name: "" }),
        },
    },
    data() {
        return {
            delimiters: ['${', '}'], // Avoid Twig conflicts
            filelist: [], // Store our uploaded files
            titleRule: [v => !!v || 'Kötelező kitölteni'],
            fileRule: [(v) => v.length > 0 || 'Dokumentumot csatolni kötelező',]
        };
    },
    computed: {
        //
    },
    methods: {
        onChange() {
            this.filelist = [...this.$refs.file.files];
        },
        remove(i) {
            this.filelist.splice(i, 1);
        },
        dragover(event) {
            event.preventDefault();
            // Add some visual fluff to show the user can drop its files
            if (!event.currentTarget.classList.contains('bg-success')) {
                event.currentTarget.classList.remove('bg-gray-100');
                event.currentTarget.classList.add('bg-success');
            }
        },
        dragleave(event) {
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-success');
        },
        drop(event) {
            event.preventDefault();
            this.$refs.file.files = event.dataTransfer.files;
            this.onChange(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-success');
        },
        async onSubmit() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) {
                return;
            }
            this.$emit("save", this.item);
        },
        closeDialog() {
            this.$emit('close');
        },
    }
}

</script>

<style scoped>
#assetsFieldHandle {
    display: none;
}

.p-50 {
    padding: 50px !important;
}

.p-20 {
    padding: 20px !important;
}

.bg-gray-100 {
    background-color: rgb(204, 204, 204) !important;
    display: inline-block !important;
}

.bg-success {
    background-color: #359756 !important;
    display: inline-block !important;
}
</style>