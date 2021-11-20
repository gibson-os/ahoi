Ext.define('GibsonOS.module.ahoi.project.publish.Window', {
    extend: 'GibsonOS.Window',
    alias: ['widget.gosModuleAhoiProjectPublishWindow'],
    title: 'Projekt veröffentlichen',
    width: 700,
    height: 97,
    resizable: true,
    maximizable: true,
    minimizable: true,
    flex: 0,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    requiredPermission: {
        module: 'ahoi',
        task: 'project'
    },
    initComponent: function() {
        var window = this;

        this.items = [{
            xtype: 'progressbar',
            itemId: 'ahoiProjectPublishBar',
            margins: 10,
            text: 'Ermittel was zu tun ist...',
            gos: {
                generatePage: function(progressBar, index) {
                    progressBar.updateProgress(
                        1 / progressBar.gos.data.length * (index+1),
                        progressBar.gos.data[index].title + ' (' + (index+1) + '/' + progressBar.gos.data.length + ')'
                    );

                    GibsonOS.Ajax.request({
                        url: baseDir + 'ahoi/page/generate',
                        params: {
                            projectId: window.gos.data.id,
                            localPath: progressBar.gos.data[index].localPath
                        },
                        success: function(response) {
                            index++;

                            if (index < progressBar.gos.data.length) {
                                progressBar.gos.generatePage(progressBar, index);
                            } else if (window.gos.data.ftpSessionId) {
                                progressBar.updateProgress(1, 'Dateien werden zum Uploaden eingetragen...');

                                GibsonOS.Ajax.request({
                                    url: baseDir + 'ahoi/project/upload',
                                    params: {
                                        id: window.gos.data.id
                                    },
                                    success: function (response) {
                                        window.down('#ahoiProjectPublishOkButton').enable();
                                    }
                                });
                                // Request machen. Wenn erfolgreich Button enablen und vll eine Message ausgeben.
                            } else {
                                window.down('#ahoiProjectPublishOkButton').enable();
                            }
                        }
                    });
                }
            },
            listeners: {
                render: function(progressBar) {
                    GibsonOS.Ajax.request({
                        url: baseDir + 'ahoi/project/pages',
                        params: {
                            id: window.gos.data.id
                        },
                        success: function(response) {
                            var data = Ext.decode(response.responseText).data;
                            progressBar.gos.data = data;
                            progressBar.gos.generatePage(progressBar, 0);
                        }
                    });
                }
            }
        }];

        if (this.gos.data.ftpSessionId) {
            this.items.push({
                xtype: 'gosModuleFtpIndexTransferTabPanel'
            });
            this.height = 300;
        }

        this.buttons = [{
            xtype: 'gosButton',
            itemId: 'ahoiProjectPublishOkButton',
            text: 'OK',
            disabled: true,
            handler: function() {
                window.close();
            }
        }];

        this.callParent();

        if (this.gos.data.ftpSessionId) {
            this.down('#ftpIndexTransferTabPanel').items.each(function (item) {
                var transferStore = item.getStore();
                var transferProxy = transferStore.getProxy();

                transferProxy.setExtraParam('id', window.gos.data.ftpSessionId);
            });
        }

        this.on('beforeclose', function(window) {
            if (window.down('#ahoiProjectPublishOkButton').isDisabled()) {
                return false;
            }

            return true;
        });
    }
});