export enum WidgetType {
  BUTTON = 'button',
  STANDARD = 'standard',
}

export enum WidgetAction {
  INIT = 'widget_init',
  FIND_TABLE = 'widget_find_table',
  INITIAL_DATA_WIDGET = 'widget_initial_data',
  SAVE_CONTACT_DATA = 'widget_save_contact_data',
  BUILD_CONTACT_POPUP = 'widget_build_contact_popup',
}

export enum WigetScreenURL {
  INIT = '/widget',
  CONTACT = '/[branch]/contact',
  HOME = '/[branch]',
}

export enum WidgetScreen {
  INIT = 'widget',
  CONTACT = 'contact',
  HOME = '',
}

export const KEY_STORE_CONTACT_PAGE = 'widget_data_contact_page';
