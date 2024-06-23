<template>
    <v-card>
        <v-card-title>Szavazás eredmények</v-card-title>
        <v-expansion-panels>
            <v-expansion-panel v-if="pollResults"v-for="(poll, index) in pollResults" :key="index">
                <v-expansion-panel-header>
                    {{ poll.question }}

                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <ChartsPieChart :chartData="{labels:poll.labels, data:poll.data}" :chartOptions="chartOptions" />
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div style="display: block; margin: 20px 20px"></div>
    </v-card>
</template>

<script>
export default {
    name: "PollResults",
    props: {
        pollResults: {
            type: Array(),
        },
    },
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        labels: "Szavazatok",
                        data: []
                    }
                ]
            },
            chartOptions: {
                maintanAspectRatio: false,
                responsive: true
            }
        }
    },
    mounted() {
        this.Polls();
    },
    computed: {

    },
    methods: {
        Polls() {

            // Szűrjük csak azokat az elemeket, ahol a 'active' érték true
            if (this.pollResults) {
                console.log(this.pollResults);
                // for (const key in this.pollResults) {
                //     if (this.pollResults.hasOwnProperty(key)) {
                //         const poll = this.pollResults[key];
                //         console.log(`Question ID: ${key}`);
                //         console.log(`Question: ${poll.question}`);
                //         console.log(`Labels: ${poll.labels.join(', ')}`);
                //         console.log(`Data: ${poll.data.join(', ')}`);
                //         console.log('----------------------');
                //     }
                // }
            }else{
                console.log("nincsenek lezárt szavazások");
            }
        },
        hasCheckedOptions(poll) {
            return poll.options.some((option) => option.checked);
        },
        handleClick(poll, choice, index) {
            if (poll.multiple === 0) {
                if (choice.checked == true) {
                    poll.options.forEach((otherChoice) => {
                        if (otherChoice.id !== choice.id) {
                            otherChoice.disabled = true;
                        }
                    });
                } else {
                    choice.checked = false;
                    poll.options.forEach((otherChoice) => {
                        if (otherChoice !== choice) {
                            otherChoice.disabled = false;
                        }
                    });
                }
            } else {
                choice.checked == !choice.checked;
            }
            this.$nextTick(() => {
                this.validate(index);
            });
        },
        validate(index) {
            const data = this.$refs[index][0];
            return data.$children.some(
                (children) => children.$options.propsData.inputValue
            );
        },
        makingPoll(poll, index) {
            this.validate(index);
            this.$emit("makingPoll", poll);
        },
    },
};
</script>

<style>
.v-application--is-ltr .v-expansion-panel-header {
    text-align: end;
}
</style>