<template>
  <TooltipButtonIcon rounded
                     icon="microsoft-excel"
                     text="Excel generálás"
                     v-on:@click="generateExcel"
  />
</template>

<script>
import * as Excel from 'exceljs/dist/exceljs.min'
import moment from "moment";

export default {
  name: 'GenerateExcel',
  props: {
    dataset: {
      type: Array,
      default(){
        return [];
      },
    },
  },
  methods: {
    async generateExcel() {
      if(this.dataset){
        const workbook = new Excel.Workbook()
        const worksheet = workbook.addWorksheet('My Sheet')
        const columns = [];
        Object.keys(this.dataset[0]).forEach(column => {
          columns.push({ header: column, key: column })
        })
        worksheet.columns = columns;

        this.dataset.forEach(row => {
          worksheet.addRow(row)
        })

        const buf = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buf], { type: 'application/octet-stream' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'riport_'+moment().format('YYYY_MM_DD_HH_mm_ss')+'.xlsx'
        link.click()
      }
    }
  }
}
</script>
