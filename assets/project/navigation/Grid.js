Ext.define('GibsonOS.module.ahoi.project.navigation.Grid', {
    extend: 'GibsonOS.grid.Panel',
    alias: ['widget.gosModuleAhoiProjectNavigationGrid'],
    itemId: 'ahoiProjectNavigationGrid',
    multiSelect: true,
    initComponent: function() {
        var grid = this;

        this.store = new GibsonOS.module.ahoi.project.store.Navigation();
        this.columns = [{
            header: 'Item ID',
            dataIndex: 'itemId',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Tiefe',
            dataIndex: 'depth',
            align: 'right',
            editor: {
                xtype: 'gosFormNumberfield',
                allowBlank: false,
                minValue: 0,
                maxValue: 100,
                hideLabel: true
            }
        }, {
            header: 'Anfangstiefe',
            dataIndex: 'startDepth',
            align: 'right',
            editor: {
                xtype: 'gosFormNumberfield',
                allowBlank: false,
                minValue: 0,
                maxValue: 100,
                hideLabel: true
            }
        }];
        this.tbar = [{
            iconCls: 'icon_system system_add',
            handler: function () {
                grid.getStore().add(new GibsonOS.module.ahoi.project.model.Navigation({
                    itemId: 'itemId',
                    startDepth: 0,
                    depth: 0
                }));
                grid.plugins[0].startEditByPosition({
                    column: 0,
                    row: grid.getStore().count()-1
                });
            }
        },{
            iconCls: 'icon_system system_delete',
            itemId: 'ahoiProjectNavigationGridDeleteButton',
            disabled: true,
            handler: function() {
                grid.getStore().remove(grid.getSelectionModel().getSelection());
            }
        }];

        this.plugins = [new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        })];

        this.callParent();

        this.on('selectionchange', function(selectionModel, records, options) {
            var deleteButton = grid.down('#ahoiProjectNavigationGridDeleteButton');

            if (records.length) {
                deleteButton.enable();
            } else {
                deleteButton.disable();
            }
        });
    }
});