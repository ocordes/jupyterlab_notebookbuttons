import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { ToolbarButton } from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import {
  NotebookActions,
  NotebookPanel,
  INotebookModel
} from '@jupyterlab/notebook';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { toArray } from '@lumino/algorithm';

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  settings: ISettingRegistry.ISettings;

  constructor(protected setting_registry: ISettingRegistry) {
    console.log('constructor');
    // read the settings
    this.setup_settings();
  }

  setup_settings(): void {
    Promise.all([this.setting_registry.load(extension.id)])
      .then(([settings]) => {
        console.log('reading settings');
        this.settings = settings;
        // update of settings is done automatically
        //settings.changed.connect(() => {
        //  this.update_settings(settings);
        //});
      })
      .catch((reason: Error) => {
        console.error(reason.message);
      });
  }

  /**
   * Create a new extension object.
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    // read all settings
    const have_runall = this.settings.get('runall').composite;
    const have_clearalloutputs = this.settings.get('clearalloutputs').composite;
    const have_deletecells = this.settings.get('deletecells').composite;
    let insert_before = this.settings.get('insertbefore').composite.toString();

    // sanity check, if insert_before doesn't exist use the first element ...
    const names = toArray(panel.toolbar.names());
    if (names.includes(insert_before) === false) {
      insert_before = names[0];
    }

    const callback_clearall = () => {
      NotebookActions.clearAllOutputs(panel.content);
    };
    const callback_deletecells = () => {
      NotebookActions.deleteCells(panel.content);
    };
    const callback_runall = () => {
      NotebookActions.runAll(panel.content, context.sessionContext);
    };
    const clearall_button = new ToolbarButton({
      className: 'jp-nb-buttons',
      iconClass: 'fa fa-snowplow',
      onClick: callback_clearall,
      tooltip: 'Clear All Outputs'
    });

    const deletecells_button = new ToolbarButton({
      className: 'jp-nb-buttons',
      iconClass: 'fa fa-trash-alt',
      onClick: callback_deletecells,
      tooltip: 'Delete Cells'
    });

    const runall_button = new ToolbarButton({
      className: 'jp-nb-buttons',
      iconClass: 'fa fa-fast-forward',
      onClick: callback_runall,
      tooltip: 'Run all'
    });

    // start column to append the icons
    if (have_deletecells === true) {
      panel.toolbar.insertBefore(
        insert_before,
        'jp-nb-deletecells',
        deletecells_button
      );
    }
    if (have_runall === true) {
      panel.toolbar.insertBefore(insert_before, 'jp-nb-runall', runall_button);
    }
    if (have_clearalloutputs === true) {
      panel.toolbar.insertBefore(
        insert_before,
        'jp-nb-cleaarall',
        clearall_button
      );
    }

    return new DisposableDelegate(() => {
      if (have_deletecells === true) {
        deletecells_button.dispose();
      }
      if (have_runall === true) {
        runall_button.dispose();
      }
      if (have_clearalloutputs === true) {
        clearall_button.dispose();
      }
    });
  }
}

/**
 * Activate the extension.
 */
function activate(
  app: JupyterFrontEnd,
  setting_registry: ISettingRegistry
): void {
  app.docRegistry.addWidgetExtension(
    'Notebook',
    new ButtonExtension(setting_registry)
  );
  console.debug(
    'JupyterLab extension jupyterlab_notebookbuttons is activated!'
  );
}

/**
 * Initialization data for the jupyterlab_nbgrader extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_notebookbuttons:plugin',
  autoStart: true,
  requires: [ISettingRegistry],
  activate: activate
};

export default extension;
