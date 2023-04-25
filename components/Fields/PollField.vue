<template>
    <v-card>
        <v-card-title>Szavazás</v-card-title>
        <v-expansion-panels>
            <v-expansion-panel v-for="(poll, index) in polls" :key="index">
                <v-expansion-panel-header>
                    {{ poll.question }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form>
                        <v-checkbox v-for="(choice, choiceIndex) in poll.choices" :key="choiceIndex" :id="poll.id"
                            :value="choice" :label="poll.choices[choiceIndex].label" :disabled="!choice.enabled"
                            @click="handleClick(poll, choice)"></v-checkbox>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script>
export default {
    name: "PollField",
    data: () => ({
        polls: [
            {
                id: "1",
                question: "q1",
                status: "",
                multiple: true,
                choices: [
                    { label: "a1", enabled: true, checked: false },
                    { label: "a2", enabled: true, checked: false },
                    { label: "a3", enabled: true, checked: false }
                ]
            },
            {
                id: "2",
                question: "q2",
                status: "",
                multiple: false,
                choices: [
                    { label: "a1", enabled: true, checked: false },
                    { label: "a2", enabled: true, checked: false }
                ]
            },
            {
                id: "3",
                question: "q3",
                status: "",
                multiple: false,
                choices: [{ label: "a1", enabled: true, checked: false }]
            }
        ]
    }),
    methods: {
        handleClick(poll, choice) {
            if (!poll.multiple) {
                if (choice.checked === false) {
                    choice.checked = true;
                    poll.choices.forEach(c => {
                        if (c.label !== choice.label) {
                            c.enabled = false;
                        }
                    });
                } else {
                    choice.checked = false;
                    poll.choices.forEach(c => {
                        c.enabled = true;
                    })
                }
            } else {
                choice.checked = !choice.checked;
            }
        }
    }
};
</script>