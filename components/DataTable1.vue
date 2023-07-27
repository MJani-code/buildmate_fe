<template>
  <div>
    <v-form ref="form">
      <v-data-table
        fixed-header
        :dark="darkTheme"
        :headers="showViewHeader"
        :items="filteredList"
        :items-per-page="itemsPerPage"
        :no-data-text="noDataText"
        :no-results-text="noResultsText"
        :loading-text="loadingText"
        :class="className"
        :disable-pagination="disablePagination"
        :hide-default-footer="hideDefaultFooter"
        :loading="isLoading"
      >

        <template v-slot:body.prepend="{ headers }" v-if="searchEnable">
          <tr>

            <td v-for="( header, headerIndex ) in headers" :key="headerIndex">
              <v-text-field :disabled="!header.canSearch"
                            :placeholder="header.canSearch ? 'Keresés' : 'Keresés titlva'"
                            @input="value => updateQuery(header.value,value)"
              />
            </td>

          </tr>
        </template>
        <template v-slot:top>
          <v-row class="mx-1 mt-5" v-if="showEditableHeaderButton">
            <v-col>
              <v-app-bar height="80">
                <v-btn v-if="showTableButton" @click="showTable = !showTable">
                  <Icon :icon="showTable ? 'chevron-up' : 'chevron-down'"/>
                </v-btn>
                <div v-if="showTitle">
                  <div class="mx-2" v-html="tableTitle+' ('+filteredList.length+')'"></div>
                </div>
                <v-spacer></v-spacer>
                <GenerateExcel :dataset="filteredList"/>
                <v-btn v-if="searchEnable" class="d-inline" color="light"
                       @click="resetSearchedColumns">
                  <Icon icon="eye"/>&nbsp;Kereső visszaállít
                </v-btn>
                <v-btn v-if="showTable" class="d-inline" color="light"
                       @click="isHeaderEditable = !isHeaderEditable">
                  <Icon :icon="isHeaderEditable ? 'eye' : 'eye-outline'"/>&nbsp;oszlopok
                </v-btn>
              </v-app-bar>

              <div class="mt-5" v-if="isHeaderEditable">
                <div v-for="(header, headerIndex) in processedHeaders"
                     :key="headerIndex"
                     :style="`background-color: ${header.visible ? 'yellow' : 'lightgrey'};border-radius: 5px;`"
                     class="pa-1 ml-1 mr-1 mb-2 d-inline-block"
                >
                  <Icon :icon="header.visible ? 'eye' : 'eye-outline'"
                        :color="header.visible ? 'grey' : ''"
                        v-on:icon-click="changeHeaderVisible(header)"
                  />
                  <span :style="`color: ${header.visible ? 'grey' : ''}`">{{ header.text }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "DataTable1",
  props: {
    showTitle: {
      type: Boolean,
      default(){
        return false;
      },
    },
    tableTitle: {
      type: String,
      default: '',
    },
    incomeList: {
      type: [Array, null],
      default: null,
    },
    incomeHeaders: {
      type: [Array, null],  // [{ text: 'label', align: 'start', sortable: false, value: 'key', visible: true }]
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    showEditableHeaderButton: {
      type: Boolean,
      default: false,
    },
    noDataText: {
      type: String,
      default: '',
    },
    noResultsText: {
      type: String,
      default: '',
    },
    loadingText: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    disablePagination: {
      type: Boolean,
      default: true,
    },
    hideDefaultFooter: {
      type: Boolean,
      default: true,
    },
    lang: {
      type: Object,
      default() {
        return {};
      },
    },
    itemsPerPage: {
      type: Number,
      default: 100,
    },
    showTableGrant: {
      type: Boolean,
      default() {
        return true;
      },
    },
    showTableButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    darkTheme: {
      type: Boolean,
      default() {
        return false;
      },
    },
    sortable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    searchEnable: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  beforeMount() {
    this.list = this.incomeList ? this.incomeList : [];
    this.filteredList = this.list;
    this.setRawHeaders();
  },
  data() {
    return {
      showTable: true,
      list: [],
      filteredList: [],
      rawHeaders: [],
      processedHeaders: [],
      viewHeader: [],
      searchableColumns: {},
      isHeaderEditable: false,
    };
  },
  computed: {
    showViewHeader() {
      return this.showTable ? this.viewHeader : [];
    },
  },
  methods: {
    setRawHeaders() {
      const headers = [];
      if (this.list.length && !this.incomeHeaders) {
        const listKeys = Object.keys(this.list[0]);
        listKeys.forEach(key => {
          let obj = { text: key, align: 'start', sortable: this.sortable, value: key, visible: true, canSearch: true };
          headers.push(obj);
        });
      }
      this.rawHeaders = this.incomeHeaders ? this.incomeHeaders : headers;
      this.setProcessHeaders();
      this.setViewHeader();
    },
    setProcessHeaders() {
      const processedHeaders = [];
      if (this.rawHeaders) {
        this.rawHeaders.forEach(header => {
          header.visible = true;
          processedHeaders.push(header);
        });
      }
      this.processedHeaders = processedHeaders;
    },
    setViewHeader() {
      const viewHeader = [];
      if (this.processedHeaders) {
        this.processedHeaders.forEach(header => {
          if (!this.incomeHeaders) {
            header.text = this.lang[header.value] ? this.lang[header.value] : header.value;
          }
          if (header.visible) {
            viewHeader.push(header);
          }
        })
      }
      this.viewHeader = viewHeader;
    },
    changeHeaderVisible(headerTo) {
      this.processedHeaders.forEach(header => {
        if (header.value === headerTo.value) {
          if (header.visible) {
            header.visible = !header.visible;
          } else {
            header.visible = true;
          }
        }
      })
      this.setViewHeader();
    },

    resetSearchedColumns(){
      this.$refs.form.reset();
      this.searchableColumns = {};
      this.filterByQuery();
    },

    updateQuery(key,value) {
      if(value === ''){
        delete this.searchableColumns[key];
      } else {
        this.searchableColumns[key] = value;
      }
      this.filterByQuery();
    },

    filterByQuery(){
      let list = JSON.parse(JSON.stringify(this.list));
      const newList = [];
      const searchableColumnsEntry = Object.entries(this.searchableColumns);
      if(searchableColumnsEntry.length){
        list.forEach(listItem => {
          let findCount = 0;
          searchableColumnsEntry.forEach(column => {
            const colVal = listItem[column[0]];
            const searchVal = column[1];
            if(colVal && searchVal){
              if(colVal.toLowerCase().indexOf(searchVal.toLowerCase())  > -1){
                findCount++;
              }
            }
          })
          if(findCount === searchableColumnsEntry.length){
            newList.push(listItem);
          }
        })
        this.filteredList = newList;
      } else {
        this.filteredList =  list;
      }
    }
  },
  watch: {
    incomeList(val) {
      this.list = val;
      this.setRawHeaders();
    },
    showTableGrant(val) {
      this.showTable = val;
    },
  },
}
</script>

<style scoped>

</style>
