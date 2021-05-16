import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_notebookbuttons extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_notebookbuttons:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_notebookbuttons is activated!');
  }
};

export default extension;
