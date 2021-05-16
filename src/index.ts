import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IDisposable, DisposableDelegate
} from '@lumino/disposable';


import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookActions, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';



/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
  class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let callback_clearall = () => {
      NotebookActions.clearAllOutputs(panel.content);
    };
    let callback_deletecells = () => {
      NotebookActions.deleteCells(panel.content);
    }
    let callback_runall = () => {
      NotebookActions.runAll(panel.content, context.sessionContext);
    };
    let clearall_button = new ToolbarButton({
      className: 'jp-nb-buttons',
      iconClass: 'fa fa-snowplow',
      onClick: callback_clearall,
      tooltip: 'Clear All Outputs'
    });

    let deletecells_button = new ToolbarButton({
      className: 'jp-nb-buttons',
      iconClass: 'fa fa-trash-alt',
      onClick: callback_deletecells,
      tooltip: 'Delete Cells'
    });

    let runall_button = new ToolbarButton({
      className: 'jp-nb-buttons',
      iconClass: 'fa fa-fast-forward',
      onClick: callback_runall,
      tooltip: 'Run all'
    })
  
    // start column to append the icons
    let i = 10;
    panel.toolbar.insertItem(i++, 'jp-nb-deletecells', deletecells_button);
    panel.toolbar.insertItem(i++, 'jp-nb-runall', runall_button);
    panel.toolbar.insertItem(i++, 'jp-nb-cleaarall', clearall_button);
    return new DisposableDelegate(() => {
      runall_button.dispose();
      clearall_button.dispose();
    });
  }
}


/**
 * Activate the extension.
 */
function activate(app: JupyterFrontEnd) {
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
  console.debug('JupyterLab extension jupyterlab_notebookbuttons is activated!')
};


/**
 * Initialization data for the jupyterlab_nbgrader extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_notebookbuttons:plugin',
  autoStart: true,
  activate: activate
};

export default extension;
