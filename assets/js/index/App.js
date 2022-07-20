Ext.define('GibsonOS.module.ahoi.index.App', {
    extend: 'GibsonOS.App',
    alias: ['widget.gosModuleAhoiIndexApp'],
    title: 'Ahoi!',
    appIcon: 'icon_ahoi',
    width: 900,
    height: 600,
    layout: 'border',
    requiredPermission: {
        module: 'ahoi',
        task: 'index'
    },
    initComponent: function() {
        var app = this;

        this.items = [{
            xtype: 'gosPanel',
            itemId: 'ahoiIndexCenter',
            region: 'center',
            layout: 'border',
            items: [{
                region: 'center'
            }]
        },{
            xtype: 'gosModuleAhoiProjectTree',
            region: 'west',
            collapsible: true,
            split: true,
            width: 250,
            flex: 0,
            hideCollapseTool: true
        }];

        this.callParent();

        this.down('gosModuleAhoiProjectTree').on('selectionchange', function(tree, records) {
            if (!records.length) {
                return false;
            }

            let item = null;
            const record = records[0];

            switch (record.get('type')) {
                case 'project':
                    item = new GibsonOS.module.ahoi.project.Form({
                        region: 'center'
                    });
                    item.loadRecord(record);

                    // const transferSessionField = item.getForm().findField('transferSession');
                    //
                    // if (record.get('transferSessionId')) {
                    //     transferSessionField.setValueById(record.get('transferSessionId'))
                    // } else {
                    //     transferSessionField.setValue(null);
                    // }

                    item.getForm().on('actioncomplete', function(form, action, options) {
                        const data = Ext.decode(action.response.responseText).data;

                        Ext.iterate(data, function(field, value) {
                            record.set(field, value);
                        });

                        record.set('leaf', false);
                        record.set('newItem', false);
                        record.commit();
                    });
                    break;
                case 'layout':
                    item = new GibsonOS.module.ahoi.project.layout.Form({
                        region: 'center'
                    });

                    item.loadRecord(record);
                    item.down('#ahoiProjectNavigationGrid').getStore().loadData(record.get('navigations'));

                    item.getForm().on('actioncomplete', function(form, action, options) {
                        item.items.each(function (field) {
                            if (field.getItemId() === 'ahoiProjectNavigationGrid') {
                                return true;
                            }

                            record.set(field.getName(), field.getValue());
                        });

                        record.set('navigations', item.down('#ahoiProjectNavigationGrid').getStore().getRange());
                        record.commit();
                    });
                    break;
                case 'partial':
                    break;
                case 'image':
                    break;
                case 'page':
                    item = new GibsonOS.module.ahoi.page.Form({
                        region: 'center'
                    });

                    item.getForm().load({
                        xtype: 'gosFormActionAction',
                        url: baseDir + 'ahoi/page/load',
                        params: {
                            localPath: record.get('localPath'),
                            projectId: record.get('projectId'),
                            newItem: record.get('newItem')
                        }
                    });

                    item.getForm().on('actioncomplete', function(form, action, options) {
                        if (action.url !== baseDir + 'ahoi/page/save') {
                            return false;
                        }

                        var data = Ext.decode(action.response.responseText).data;
                        record.set('localPath', data.localPath);
                        record.set('text', data.navigationText);
                        record.set('newItem', false);
                        record.commit();

                        form.findField('localPath').setValue(data.localPath);
                        form.findField('newItem').setValue(false);
                    });
                    break;
            }

            app.down('#ahoiIndexCenter').removeAll();
            app.down('#ahoiIndexCenter').add(item);
        });

        /*this.down('#ahoiProjectTree').on('beforeselect', function(tree, record) {
         var form = app.down('#ahoiIndexCenter').items.first();
         console.log(tree.getSelectionModel());

         if (form.isDirty()) {
         GibsonOS.MessageBox.show({
         title: 'Ohne speichern fortfahren?',
         msg: 'Die Seite wurde nicht gespeichert. Möchten Sie fortfahren?',
         type: GibsonOS.MessageBox.type.QUESTION,
         buttons: [{
         text: 'Ja',
         handler: function() {
         return true;
         }
         },{
         text: 'Nein'
         }]
         });

         return false;
         }
         });*/
    }
});