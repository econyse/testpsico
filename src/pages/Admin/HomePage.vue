<template>
  <q-page>
    <div :class="$q.screen.lt.sm ? 'row' : 'row justify-center'">
      <div class="q-pa-md">
        <q-table
          title="Encuestas"
          :rows="rows"
          :columns="columns"
          row-key="name"
          hide-pagination
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>
              <q-td key="questions" :props="props">
                {{ props.row.questions }}
              </q-td>
              <q-td key="status" :props="props">
                <q-badge
                  v-if="!props.row.status"
                  class="text-black"
                  color="blue-grey-11"
                >
                  10/15
                </q-badge>
                <q-badge v-else color="positive"> 15/15 </q-badge>
              </q-td>
              <q-td key="questions" :props="props">
                <q-btn
                  label="Reporte"
                  color="positive"
                  :to="props.row.actions"
                  size="sm"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { api } from "src/boot/axios";
export default {
  setup() {
    const columns = [
      {
        name: "name",
        requierd: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "description",
        label: "Descripción",
        align: "center",
        field: "description",
      },
      {
        name: "questions",
        label: "Preguntas",
        align: "center",
        field: "questions",
      },
      {
        name: "status",
        label: "Estado",
        align: "center",
        field: "status",
      },
      {
        name: "actions",
        label: "Acciones",
        align: "right",
        field: "actions",
      },
    ];
    const rows = [
      {
        name: "Test",
        description: "Descripción",
        questions: 16,
        status: false,
        actions: "/admin/reporte",
      },
      {
        name: "Test",
        description: "Descripción",
        questions: 16,
        status: true,
        actions: "/alumno/test",
      },
    ];

    return {
      columns,
      rows,
    };
  },
};
</script>
