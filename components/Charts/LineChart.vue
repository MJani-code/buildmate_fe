<template>
    <div>
        <canvas ref="myChart" class="pollresults"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);


export default {
    data() {
        return {
            chart: null
        };
    },
    mounted() {
        this.renderChart();
    },
    methods: {
        renderChart() {
            const ctx = this.$refs.myChart.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: '# of Votes',
                        data: [19, 12, 3, 5, 2, 3, 5],
                        backgroundColor: [
                            'rgba(53, 151, 86, 1.0)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(235, 162, 54, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 75, 192, 0.2)',
                            'rgba(144, 238, 144, 0.2)',
                            'rgba(139, 0, 0, 0.2)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            display: false,
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            display: false,
                            grid: {
                                display: false
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels],
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
};
</script>

<style>
.pollresults {}
</style>