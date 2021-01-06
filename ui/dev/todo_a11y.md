# CSS related

| Status | Aria / Role | CSS |
| --- | --- | --- |
| :white_check_mark: | [aria-busy="true"] | cursor: progress |
| :white_check_mark: | [aria-controls], [role="button"] | cursor: pointer |
| :white_check_mark: | [aria-disabled] | cursor: default |

# Input type possible roles

| Input type | Role |
| --- | --- |
| button | link, menuitem, menuitemcheckbox, menuitemradio, radio, switch, tab |
| checkbox | button, menuitemcheckbox, option, switch |
| image | link, menuitem, menuitemcheckbox, menuitemradio, radio, switch |
| radio | menuitemradio |

# Aria / Role combinations per component type

| Status | Generic class | Components | Aria | Role |
|--- |--- |--- |--- |--- |
| TODO | disabled | | aria-disabled | |
| TODO | readonly | | aria-readonly | |
| TODO | popup activators | | aria-haspopup, aria-expanded="true/false" | button |
| :white_check_mark: | checkbox / radio | | aria-checked="true/false/mixed" (indeterminate) | checkbox / radio |
| TODO | close button in alerts, dialog plugin | | aria-label=$t(close) | button |
| :white_check_mark: | alert | | | alert |
| TODO | options list - autocomplete | | | combobox |
| TODO | breadcrumb item | | IF active and link THEN aria-current="page" | |
| TODO | carousel, panels | | aria-label="item {ord} of {len}" | |
| TODO | table header | | aria-label="{header label}", aria-sort="none/ascending/descending" | columnheader |
| TODO | dialogs | | | dialog (external?), document (internal?) |
| :white_check_mark: | separators | | aria-orientation="vertical/horizontal" | separator |
| TODO | expand trigger | | aria-expanded="true/false" | |
| TODO | icon normal | | aria-hidden | IF click THEN button |
| :white_check_mark: | icon svg | | aria-label, IF no label THEN aria-hidden | img |
| :white_check_mark: | image | | aria-label="{alt} | IF alt THEN img |
| TODO | field error/warning | | | alert |
| TODO | list | | IF NOT menu/navigation THEN list |
| TODO | list of options | | listbox |
| TODO | list item | | IF selectable THEN aria-selected="true/false" | listitem |
| TODO | list item in menu - clickable | | | menuitem |
| TODO | menu | | | menu |
| :white_check_mark: | progress | | aria-valuemin="...", aria-valuemax="...", IF NOT indeterminate THEN aria-valuenow="..." | progressbar |
| :white_check_mark: | radio group | | aria-labelledby="{label}" | radiogroup |
| TODO | select - toggle button | | aria-haspopup="listbox", aria-expanded="true/false", aria-owns="{id of list}" | button |
| TODO | select - list | | | listbox |
| TODO | select - list item | | aria-selected="true/false", aria-labelledby="{option label}" | option |
| TODO | placeholder element | | aria-busy, aria-live="polite" | alert |
| :white_check_mark: | slider, range | | aria-label="{label}", aria-valuemin="...", aria-valuemax="...", aria-valuenow="...", aria-orientation="vertical/horizontal" | slider |
| :white_check_mark: | toggle | | aria-checked="true/false" | switch |
| :white_check_mark: | tabs group | | | tablist |
| :white_check_mark: | tab item | | aria-selected="true/false" | tab |
| TODO | tree - collapsible toggle | | aria-expanded="true/false" | |

# Refs

[MDN Aria details](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
