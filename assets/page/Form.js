Ext.define('GibsonOS.module.ahoi.page.Form', {
    extend: 'GibsonOS.form.Panel',
    alias: ['widget.gosModuleAhoiPageForm'],
    itemId: 'ahoiPageForm',
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
            name: 'newItem'
        },{
            xtype: 'gosFormHidden',
            name: 'localPath'
        },{
            xtype: 'gosFormHidden',
            name: 'projectId'
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Dateiname',
            name: 'filename'
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Titel',
            name: 'title'
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Navigationspunkt',
            name: 'navigationText'
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Keywords',
            name: 'keywords'
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Vererbte Keywords',
            name: 'inheritedKeywords',
            submitVaue: false,
            disabled: true
        },{
            xtype: 'gosFormTextfield',
            fieldLabel: 'Zu vererbende Keywords',
            name: 'inheritingKeywords'
        },{
            xtype: 'gosFormTextArea',
            fieldLabel: 'Beschreibung',
            name: 'description'
        },{
            xtype: 'gosFormHtmlEditor',
            hideLabel: true,
            name: 'html',
            flex: 1
        }];

        this.buttons = [{
            text: 'Speichern',
            itemId: 'ahoiPageFormSaveButton',
            requiredPermission: {
                action:'save',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                form.getForm().submit({
                    xtype: 'gosFormActionAction',
                    url: baseDir + 'ahoi/page/save',
                    success: function(form, action) {
                        GibsonOS.MessageBox.show({
                            title: 'Gespeichert!',
                            msg: 'Seite wurde erfolgreich gespeichert!',
                            type: GibsonOS.MessageBox.type.INFO
                        });
                    }
                })
            }
        }];

        this.callParent();
    }
});