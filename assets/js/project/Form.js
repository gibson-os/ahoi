Ext.define('GibsonOS.module.ahoi.project.Form', {
    extend: 'GibsonOS.module.core.component.form.Panel',
    alias: ['widget.gosModuleAhoiProjectForm'],
    flex: 0,
    requiredPermission: {
        module: 'ahoi',
        task: 'project'
    },
    initComponent: function() {
        const me = this;

        this.items = [{
            xtype: 'gosFormHidden',
            name: 'id',
            listeners: {
                change: function(field, newValue, oldValue) {
                    var publishButton = me.down('#ahoiProjectFormPublishButton');

                    if (newValue > 0) {
                        publishButton.enable();
                    } else {
                        publishButton.disable();
                    }
                }
            }
        },{
            xtype: 'gosCoreComponentFormFieldTextField',
            fieldLabel: 'Name',
            name: 'name'
        },{
            xtype: 'gosCoreComponentFormFieldContainer',
            fieldLabel: 'Lokales Verzeichnis',
            layout: 'hbox',
            defaults: {
                hideLabel: true
            },
            items: [{
                xtype: 'gosCoreComponentFormFieldTextField',
                name: 'localPath',
                flex: 1,
                margins: '0 5 0 0'
            },{
                xtype: 'gosButton',
                text: '...',
                handler: function() {
                    GibsonOS.module.explorer.dir.fn.dialog(me.getForm().findField('localPath'));
                }
            }]
        // },{
        //     xtype: 'gosModuleTransferSessionAutoComplete',
        //     fieldLabel: 'Verbindung',
        //     name: 'transferSession',
        //     listeners: {
        //         change: function(combo, newValue, oldValue, options) {
        //             var remotePath = me.down('#ahoiProjectFormRemotePath');
        //             var remotePathField = me.getForm().findField('remotePath');
        //             var record = combo.findRecordByValue(newValue);
        //
        //             if (record) {
        //                 if (!remotePathField.getValue()) {
        //                     remotePathField.setValue(record.get('remotePath'));
        //                 }
        //
        //                 remotePath.enable();
        //             } else {
        //                 remotePath.disable();
        //                 remotePathField.setValue(null);
        //             }
        //         }
        //     }
        },{
            xtype: 'gosCoreComponentFormFieldContainer',
            fieldLabel: 'Entferntes Verzeichnis',
            itemId: 'ahoiProjectFormRemotePath',
            disabled: true,
            layout: 'hbox',
            defaults: {
                hideLabel: true
            },
            items: [{
                xtype: 'gosCoreComponentFormFieldTextField',
                name: 'remotePath',
                flex: 1,
                margins: '0 5 0 0'
            },{
                xtype: 'gosButton',
                text: '...',
                handler: function() {
                    var remotePathField = me.getForm().findField('remotePath');
                    var remotePath = remotePathField.getValue();

                    var dialog = new GibsonOS.module.transfer.index.Dialog({
                        gos: {
                            data: {
                                dir: remotePath ? remotePath : null,
                                id: me.getForm().findField('transferSession').getValue()
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
            xtype: 'gosCoreComponentFormFieldCheckbox',
            name: 'onlyForThisUser',
            inputValue: true,
            fieldLabel: 'Zugriff',
            boxLabel: 'Nur für den aktuellen Benutzer'
        }];

        me.buttons = [{
            text: 'Speichern',
            itemId: 'ahoiProjectFormSaveButton',
            requiredPermission: {
                action:'save',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                me.getForm().submit({
                    xtype: 'gosFormActionAction',
                    url: baseDir + 'ahoi/project/save',
                    success: function(form, action) {
                        me.findField('id').setValue(Ext.decode(action.response.responseText).data.id);

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
                            id: me.getForm().findField('id').getValue(),
                            transferSessionId: me.getForm().findField('transferSession').getValue()
                        }
                    }
                });
                /*me.getForm().submit({
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