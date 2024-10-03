<% /* TODO: Create a shared package for App Extensions */ %>
// This file is here to unify the types for the App Extension API

import {
  IndexAPI as BaseViteIndexAPI,
  InstallAPI as BaseViteInstallAPI,
  PromptsAPI as BaseVitePromptsAPI,
  UninstallAPI as BaseViteUninstallAPI,
} from '@quasar/app-vite/types';

import {
  IndexAPI as BaseWebpackIndexAPI,
  InstallAPI as BaseWebpackInstallAPI,
  PromptsAPI as BaseWebpackPromptsAPI,
  UninstallAPI as BaseWebpackUninstallAPI,
} from '@quasar/app-webpack/types';

export type IndexAPI = BaseViteIndexAPI | BaseWebpackIndexAPI;

export type InstallAPI = BaseViteInstallAPI | BaseWebpackInstallAPI;

export type PromptsAPI = BaseVitePromptsAPI | BaseWebpackPromptsAPI;

export type UninstallAPI = BaseViteUninstallAPI | BaseWebpackUninstallAPI;
