Ext.define('GibsonOS.module.ahoi.project.Form', {
    extend: 'GibsonOS.form.Panel',
    alias: ['widget.gosModuleAhoiProjectForm'],
    itemId: 'ahoiProjectForm',
    flex: 0,
    requiredPermission: {
        module: 'ahoi',
        task: 'project'
    },
    initComponent: function() {
        var form = this;

        this.items = [{
            xtype: 'gosFormHidden',
            name: 'id',
            listeners: {
                change: function(field, newValue, oldValue) {
                    var publishButton = form.down('#ahoiProjectFormPublishButton');

                    if (newValue > 0) {
                        publishButton.enable();
                    } else {
                        publishButton.disable();
                    }
                }
            }
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Name',
            name: 'name'
        },{
            xtype: 'fieldcontainer',
            fieldLabel: 'Lokales Verzeichnis',
            layout: 'hbox',
            defaults: {
                hideLabel: true
            },
            items: [{
                xtype: 'gosFormTextfield',
                name: 'localPath',
                flex: 1,
                margins: '0 5 0 0'
            },{
                xtype: 'gosButton',
                text: '...',
                handler: function() {
                    GibsonOS.module.explorer.dir.fn.dialog(form.getForm().findField('localPath'));
                }
            }]
        },{
            xtype: 'gosModuleTransferSessionAutoComplete',
            fieldLabel: 'Verbindung',
            name: 'transferSession',
            listeners: {
                change: function(combo, newValue, oldValue, options) {
                    var remotePath = form.down('#ahoiProjectFormRemotePath');
                    var remotePathField = form.getForm().findField('remotePath');
                    var record = combo.findRecordByValue(newValue);

                    if (record) {
                        if (!remotePathField.getValue()) {
                            remotePathField.setValue(record.get('remotePath'));
                        }

                        remotePath.enable();
                    } else {
                        remotePath.disable();
                        remotePathField.setValue(null);
                    }
                }
            }
        },{
            xtype: 'fieldcontainer',
            fieldLabel: 'Entferntes Verzeichnis',
            itemId: 'ahoiProjectFormRemotePath',
            disabled: true,
            layout: 'hbox',
            defaults: {
                hideLabel: true
            },
            items: [{
                xtype: 'gosFormTextfield',
                name: 'remotePath',
                flex: 1,
                margins: '0 5 0 0'
            },{
                xtype: 'gosButton',
                text: '...',
                handler: function() {
                    var remotePathField = form.getForm().findField('remotePath');
                    var remotePath = remotePathField.getValue();

                    var dialog = new GibsonOS.module.transfer.index.Dialog({
                        gos: {
                            data: {
                                dir: remotePath ? remotePath : null,
                                id: form.getForm().findField('transferSession').getValue()
                            }
                        }
                    });
                    dialog.down('#gosModuleTransferIndexDialogOkButton').handler = function() {
                        var record = dialog.down('gosModuleTransferIndexTree').getSelectionModel().getSelection()[0];
                        remotePathField.setValue(record.get('id'));
                        dialog.close();
                    }
                }
            }]
        },{
            xtype: 'gosFormCheckbox',
            name: 'onlyForThisUser',
            inputValue: true,
            fieldLabel: 'Zugriff',
            boxLabel: 'Nur für den aktuellen Benutzer'
        }];

        this.buttons = [{
            text: 'Speichern',
            itemId: 'ahoiProjectFormSaveButton',
            requiredPermission: {
                action:'save',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                form.getForm().submit({
                    xtype: 'gosFormActionAction',
                    url: baseDir + 'ahoi/project/save',
                    success: function(form, action) {
                        form.findField('id').setValue(Ext.decode(action.response.responseText).data.id);

                        GibsonOS.MessageBox.show({
                            title: 'Gespeichert!',
                            msg: 'Projekt wurde erfolgreich gespeichert!',
                            type: GibsonOS.MessageBox.type.INFO
                        });
                    }
                })
            }
        },{
            text: 'Veröffentlichen',
            itemId: 'ahoiProjectFormPublishButton',
            disabled: true,
            requiredPermission: {
                action:'publish',
                permission: GibsonOS.Permission.MANAGE + GibsonOS.Permission.WRITE
            },
            handler: function() {
                // Beim klick sollte sich das publish fenster öffnen.
                // Das besteht aus einer Loading Bar in der die Seite steht die aktuell generiert wird plus einem Zähler
                // Nachdem alles generiert wurde zeigt der Ladebalken (oder wer anders) an das die Dateien an den FTP übergeben werden
                // Darunter ist ein FTP Transfer Liste zu sehen. Falls eine FTP Verbindung hinterlegt ist
                // Unten ist ein disableter OK Button. Er wird erst enabled wenn alles fertig ist
                new GibsonOS.module.ahoi.project.publish.Window({
                    gos: {
                        data: {
                            id: form.getForm().findField('id').getValue(),
                            transferSessionId: form.getForm().findField('transferSession').getValue()
                        }
                    }
                });
                /*form.getForm().submit({
                 xtype: 'gosFormActionAction',
                 url: baseDir + 'ahoi/project/publish',
                 success: function(form, action) {
                 GibsonOS.MessageBox.show({
                 title: 'Veröffentlicht!',
                 msg: 'Projekt wurde erfolgreich veröffenlicht!',
                 type: GibsonOS.MessageBox.type.INFO
                 });
                 }
                 });*/
            }
        }];

        this.callParent();
    }
});