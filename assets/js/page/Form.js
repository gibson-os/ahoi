Ext.define('GibsonOS.module.ahoi.page.Form', {
    extend: 'GibsonOS.module.core.component.form.Panel',
    alias: ['widget.gosModuleAhoiPageForm'],
    flex: 0,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    requiredPermission: {
        module: 'ahoi',
        task: 'page'
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
            xtype: 'gosCoreComponentFormFieldTextField',
            fieldLabel: 'Dateiname',
            name: 'filename'
        },{
            xtype: 'gosCoreComponentFormFieldTextField',
            fieldLabel: 'Titel',
            name: 'title'
        },{
            xtype: 'gosCoreComponentFormFieldTextField',
            fieldLabel: 'Navigationspunkt',
            name: 'navigationText'
        },{
            xtype: 'gosCoreComponentFormFieldTextField',
            fieldLabel: 'Keywords',
            name: 'keywords'
        },{
            xtype: 'gosCoreComponentFormFieldTextField',
            fieldLabel: 'Vererbte Keywords',
            name: 'inheritedKeywords',
            submitVaue: false,
            disabled: true
        },{
            xtype: 'gosCoreComponentFormFieldTextField',
            fieldLabel: 'Zu vererbende Keywords',
            name: 'inheritingKeywords'
        },{
            xtype: 'gosCoreComponentFormFieldTextArea',
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