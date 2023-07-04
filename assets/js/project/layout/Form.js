Ext.define('GibsonOS.module.ahoi.project.layout.Form', {
    extend: 'GibsonOS.form.Panel',
    alias: ['widget.gosModuleAhoiProjectLayoutForm'],
    itemId: 'ahoiProjectLayoutForm',
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
        var form = this;

        this.items = [{
            xtype: 'gosFormHidden',
            name: 'projectId'
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Title',
            name: 'title'
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'URL',
            name: 'url'
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Content Item ID',
            name: 'contentItemId'
        },{
            xtype: 'gosModuleAhoiProjectNavigationGrid',
            flex: 0,
            height: 150
        },{
            xtype: 'gosFormTextArea',
            hideLabel: true,
            name: 'template',
            flex: 1
        }];

        this.buttons = [{
            text: 'Speichern',
            itemId: 'ahoiProjectLayoutFormSaveButton',
            requiredPermission: {
                action: 'layout',
                permission: GibsonOS.Permission.WRITE,
                method: 'POST'
            },
            handler: function() {
                var navigations = [];

                form.down('#ahoiProjectNavigationGrid').getStore().each(function(record) {
                    navigations.push(record.getData());
                });

                form.getForm().submit({
                    xtype: 'gosFormActionAction',
                    url: baseDir + 'ahoi/project/layout',
                    method: 'POST',
                    params: {
                        'navigations': Ext.encode(navigations)
                    },
                    success: function(form, action) {
                        GibsonOS.MessageBox.show({
                            title: 'Gespeichert!',
                            msg: 'Layout wurde erfolgreich gespeichert!',
                            type: GibsonOS.MessageBox.type.INFO
                        });
                    }
                })
            }
        }];

        this.callParent();
    }
});