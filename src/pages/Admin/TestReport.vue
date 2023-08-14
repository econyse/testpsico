<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Reporte"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="selcarrera"
        v-model:pagination="pagination"
        @request="loadAnswers"
      >
        <template v-slot:top>
          <q-select
            rounded
            hide-bottom-space
            outlined
            v-model="selcarrera"
            :options="carreras"
            label="Carrera"
            emit-value
            map-options
            input-style="width: 1000px"
          />
          <q-btn
            color="primary"
            :disable="loading"
            label="Buscar"
            @click="loadAnswers"
          />
          <q-space></q-space>
          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="exportTable"
          />
        </template>

        <template v-slot:header-cell-k="props">
          <q-th :props="props" class="bg-purple-14">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:header-cell-a="props">
          <q-th :props="props" class="bg-cyan-5">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:header-cell-r="props">
          <q-th :props="props" class="bg-lime-13">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:header-cell-v="props">
          <q-th :props="props" class="bg-orange-8">
            {{ props.col.label }}
          </q-th>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script>
import { ref } from "vue";
import { api } from "src/boot/axios";
import { exportFile, useQuasar } from "quasar";
export default {
  setup() {
    const $q = useQuasar();
    const loading = ref(true);
    const selcarrera = ref(null);
    const carreras = [
      {
        label: "Administración",
        value: 1,
      },
      {
        label: "Energías Renovables",
        value: 2,
      },
      {
        label: "Mantenimiento Industrial",
        value: 3,
      },
      {
        label: "Mecatrónica",
        value: 4,
      },
      {
        label: "Procesos Industriales",
        value: 5,
      },
      {
        label: "Tecnologías de la Información",
        value: 6,
      },
    ];
    const columns = [
      {
        name: "id",
        requierd: true,
        label: "ID",
        align: "left",
        field: "id",
        sortable: true,
      },
      {
        name: "flastname",
        requierd: true,
        label: "Apellido Paterno",
        align: "left",
        field: (row) => row.flastname,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "mlastname",
        requierd: false,
        label: "Apellido materno",
        align: "left",
        field: (row) => row.mlastname,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "name",
        requierd: false,
        label: "Nombre",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "carrera",
        label: "Carrera",
        align: "center",
        field: "carrera",
        sortable: false,
      },
      {
        name: "k",
        label: "K",
        align: "center",
        field: "k",
      },
      {
        name: "a",
        label: "A",
        align: "center",
        field: "a",
      },
      {
        name: "r",
        label: "R",
        align: "center",
        field: "r",
      },
      {
        name: "v",
        label: "V",
        align: "center",
        field: "v",
      },
      {
        name: "total",
        label: "Total",
        align: "center",
        field: "total",
      },
    ];
    const rows = ref([]);
    const pagination = ref({
      sortBy: "flastname",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
    });
    function loadAnswers(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;
      loading.value = true;
      api
        .get(
          "/api/test-answers?populate=users_permissions_user&filters[createdAt][$gte]=2023-01-01&filters[createdAt][$lte]=2023-12-31" +
            (sortBy == "flastname"
              ? "&sort[0]=users_permissions_user.flastname%3A" +
                (descending ? "desc" : "asc") +
                "&sort[1]=users_permissions_user.mlastname%3A" +
                (descending ? "desc" : "asc") +
                "&sort[2]=users_permissions_user.name%3A" +
                (descending ? "desc" : "asc")
              : "&sort[0]=id%3A" + (descending ? "desc" : "asc")) +
            "&pagination[pageSize]=" +
            (rowsPerPage != 0 ? rowsPerPage : 2000) +
            "&pagination[page]=" +
            page +
            (selcarrera.value == null
              ? ""
              : "&filters[carrera]=" + selcarrera.value)
        )
        .then((res) => {
          let data = res.data.data;
          let meta = res.data.meta;
          pagination.value.rowsNumber = meta.pagination.total;
          console.log(res);
          var rs = [];
          data.forEach((element) => {
            let k = 0;
            let a = 0;
            let r = 0;
            let v = 0;
            for (var i = 1; i <= 16; i++) {
              if (element.attributes.answers[i].includes("K")) k++;
              if (element.attributes.answers[i].includes("A")) a++;
              if (element.attributes.answers[i].includes("R")) r++;
              if (element.attributes.answers[i].includes("V")) v++;
            }
            let row = {
              id: element.id,
              name: element.attributes.users_permissions_user.data.attributes
                .name,
              flastname:
                element.attributes.users_permissions_user.data.attributes
                  .flastname,
              mlastname:
                element.attributes.users_permissions_user.data.attributes
                  .mlastname,
              carrera:
                carreras[
                  element.attributes.users_permissions_user.data.attributes
                    .carrera - 1
                ].label,
              k: k,
              a: a,
              r: r,
              v: v,
              total: k + a + r + v,
            };
            rs.push(row);
          });
          rows.value = rs;
          pagination.value.page = page;
          pagination.value.rowsPerPage = rowsPerPage;
          pagination.value.sortBy = sortBy;
          pagination.value.descending = descending;
          loading.value = false;
        });
    }
    function wrapCsvValue(val, formatFn, row) {
      let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

      formatted =
        formatted === void 0 || formatted === null ? "" : String(formatted);

      formatted = formatted.split('"').join('""');
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`;
    }
    function exportTable() {
      // naive encoding to csv format
      const content = [columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          rows.value.map((row) =>
            columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                  row
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile(
        "table-export.csv",
        "\ufeff" + content,
        "text/csv"
      );

      if (status !== true) {
        $q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    }
    return {
      loading,
      columns,
      rows,
      pagination,
      selcarrera,
      carreras,
      loadAnswers,
      exportTable,
    };
  },
  mounted() {
    this.loadAnswers({
      pagination: this.pagination,
      filter: undefined,
    });
  },
};
</script>
