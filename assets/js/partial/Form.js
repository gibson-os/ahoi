Ext.define('GibsonOS.module.ahoi.partial.Form', {
    extend: 'GibsonOS.module.core.component.form.Panel',
    alias: ['widget.gosModuleAhoiPartialForm'],
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
            xtype: 'gosCoreComponentFormFieldTextField',
            fieldLabel: 'Name',
            name: 'name'
        },{
            xtype: 'gosCoreComponentFormFieldTextArea',
            fieldLabel: 'Partial',
            name: 'partial',
            flex: 1
        }];

        this.buttons = [{
            text: 'Speichern',
            requiredPermission: {
                action:'save',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                form.getForm().submit({
                    xtype: 'gosFormActionAction',
                    url: baseDir + 'ahoi/partial/save',
                    success: function(form, action) {
                        GibsonOS.MessageBox.show({
                            title: 'Gespeichert!',
                            msg: 'Partial wurde erfolgreich gespeichert!',
                            type: GibsonOS.MessageBox.type.INFO
                        });
                    }
                })
            }
        }];

        this.callParent();
    }
});