<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">QDashboardPanel Demo</div>
    <div class="text-caption text-grey q-mb-lg">
      Resizable, collapsible, persisted dashboard panels. Try dragging the right edge to resize, or double-click the handle to maximize.
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start;">
      <q-dashboard-panel
        id="demo-panel-1"
        :default-size="40"
        :min-size="20"
        :max-size="70"
        :resizable="true"
      >
        <template #header="{ collapsed, maximized, toggleCollapsed, toggleMaximized }">
          <div class="row items-center no-wrap full-width">
            <q-icon name="dashboard" class="q-mr-sm" color="primary" />
            <div class="text-subtitle1">Panel 1</div>
            <q-space />
            <q-btn
              flat
              round
              dense
              :icon="collapsed ? 'expand_more' : 'expand_less'"
              @click="toggleCollapsed"
            >
              <q-tooltip>{{ collapsed ? 'Expand' : 'Collapse' }}</q-tooltip>
            </q-btn>
            <q-btn flat round dense :icon="maximized ? 'fullscreen_exit' : 'fullscreen'" @click="toggleMaximized">
              <q-tooltip>{{ maximized ? 'Restore' : 'Maximize' }}</q-tooltip>
            </q-btn>
          </div>
        </template>

        <template #body>
          <div class="q-pa-md">
            <p>This is the body content. Try these interactions:</p>
            <ul>
              <li>Drag the right edge to resize</li>
              <li>Double-click the resize handle to maximize/restore</li>
              <li>Click collapse button to hide body</li>
              <li>Reload the page - state is persisted!</li>
            </ul>
          </div>
        </template>

        <template #footer>
          <div class="text-caption text-grey">Footer content</div>
        </template>
      </q-dashboard-panel>

      <q-dashboard-panel
        id="demo-panel-2"
        :default-size="30"
        :min-size="15"
        :max-size="70"
        :resizable="true"
        bordered
      >
        <template #header="{ collapsed, toggleCollapsed, maximized, toggleMaximized }">
          <div class="row items-center no-wrap full-width">
            <q-icon name="analytics" class="q-mr-sm" color="secondary" />
            <div class="text-subtitle1">Panel 2 (Bordered)</div>
            <q-space />
            <q-btn
              flat
              round
              dense
              :icon="collapsed ? 'expand_more' : 'expand_less'"
              @click="toggleCollapsed"
            />
            <q-btn
              flat
              round
              dense
              :icon="maximized ? 'fullscreen_exit' : 'fullscreen'"
              @click="toggleMaximized"
            />
          </div>
        </template>

        <template #body>
          <div class="q-pa-md">
            <p>Second panel with bordered style.</p>
            <p class="text-caption">Default size: 30%</p>
          </div>
        </template>
      </q-dashboard-panel>
    </div>

    <q-separator class="q-my-lg" />

    <div class="text-h6 q-mb-md">Pixel Units</div>

    <div class="row q-gutter-md">
      <q-dashboard-panel
        id="demo-panel-px"
        :default-size="300"
        :min-size="200"
        :max-size="600"
        unit="px"
        :resizable="false"
        flat
        bordered
      >
        <template #header="{ toggleCollapsed }">
          <div class="row items-center no-wrap full-width">
            <div class="text-subtitle1">Fixed Width Panel</div>
            <q-space />
            <q-btn flat round dense icon="unfold_less" @click="toggleCollapsed" />
          </div>
        </template>

        <template #body>
          <div class="q-pa-md">
            <p>This panel uses pixel units.</p>
            <p class="text-caption">Range: 200px - 600px</p>
          </div>
        </template>
      </q-dashboard-panel>
    </div>

    <q-separator class="q-my-lg" />

    <div class="text-h6 q-mb-md">Dark Mode</div>

    <div style="display: flex; align-items: flex-start; width: 100%;">
      <q-dashboard-panel
        id="demo-panel-dark"
        :default-size="50"
        :min-size="20"
        :max-size="80"
        :resizable="true"
        dark
      >
        <template #header="{ collapsed, maximized, toggleCollapsed, toggleMaximized }">
          <div class="row items-center no-wrap full-width text-white">
            <q-icon name="dark_mode" class="q-mr-sm" />
            <div class="text-subtitle1">Dark Panel</div>
            <q-space />
            <q-btn
              flat
              round
              dense
              color="white"
              :icon="collapsed ? 'expand_more' : 'expand_less'"
              @click="toggleCollapsed"
            />
            <q-btn
              flat
              round
              dense
              color="white"
              :icon="maximized ? 'fullscreen_exit' : 'fullscreen'"
              @click="toggleMaximized"
            />
          </div>
        </template>

        <template #body>
          <div class="q-pa-md text-white">
            Panel with dark mode enabled.
          </div>
        </template>
      </q-dashboard-panel>
    </div>
  </div>
</template>

<script>
import { QDashboardPanel } from 'quasar'
export default {
  name: 'DashboardPanelDemo',
  components: {
    QDashboardPanel
  }
}
</script>
