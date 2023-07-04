Ext.define('GibsonOS.module.ahoi.project.Tree', {
    extend: 'GibsonOS.tree.Panel',
    alias: ['widget.gosModuleAhoiProjectTree'],
    displayField: 'name',
    requiredPermission: {
        module: 'ahoi',
        task: 'project'
    },
    header: false,
    initComponent: function() {
        var tree = this;

        this.store = new GibsonOS.module.ahoi.project.store.Tree({
            gos: {
                tree: this
            }
        });

        this.tbar = [{
            iconCls: 'icon_system system_add',
            menu: [{
                iconCls: 'icon_system system_add',
                text: 'Neues Projekt',
                requiredPermission: {
                    action: '',
                    permission: GibsonOS.Permission.WRITE,
                    method: 'POST'
                },
                handler: function () {
                    if (tree.getStore().getNodeById(0)) {
                        return false;
                    }

                    tree.getSelectionModel().select(tree.getRootNode().appendChild({
                        id: 0,
                        name: '(Neues Projekt)',
                        type: 'project',
                        leaf: true,
                        newItem: true
                    }));
                }
            },{
                iconCls: 'icon_system system_add',
                itemId: 'ahoiProjectTreeAddPageButton',
                text: 'Neue Seite',
                disabled: true,
                requiredPermission: {
                    task: 'page',
                    action: '',
                    permission: GibsonOS.Permission.WRITE,
                    method: 'POST'
                },
                handler: function() {
                    var selectedNodes = tree.getSelectionModel().getSelection();
                    var selectedNode = selectedNodes[0];

                    tree.getSelectionModel().select(selectedNode.appendChild({
                        id: 'page_' + Ext.id(),
                        text: '(Neue Seite)',
                        type: 'page',
                        leaf: 'true',
                        projectId: selectedNode.get('projectId'),
                        localPath: selectedNode.get('localPath'),
                        newItem: true
                    }));
                    selectedNode.set('leaf', false);
                    selectedNode.expand();
                }
            }]
        },{
            iconCls: 'icon_system system_delete',
            itemId: 'ahoiProjectTreeDeleteButton',
            disabled: true,
            handler: function() {
                var record = tree.getSelectionModel().getSelection()[0];
                var url = baseDir + 'ahoi/';
                var msg = null;

                switch (record.get('type')) {
                    case 'project':
                        url += 'project';
                        msg = 'Projekt';
                        break;
                    case 'page':
                        url += 'page';
                        msg = 'Seite';
                        break;
                    case 'partial':
                        url += 'partial';
                        msg = 'Partial';
                        break;
                }

                GibsonOS.MessageBox.show({
                    title: msg + ' wirklich löschen?',
                    msg: msg + ' ' + record.get('name') + ' wirklich löschen?',
                    type: GibsonOS.MessageBox.type.QUESTION,
                    buttons: [{
                        text: 'Ja',
                        sendRequest: record.get('newItem') ? false : true,
                        handler: function() {
                            var removeItem = function() {
                                var parent = record.parentNode;

                                if (
                                    parent.get('type') === 'page' &&
                                    parent.childNodes.length == 1
                                ) {
                                    parent.set('leaf', true);
                                }

                                record.remove();
                            };

                            if (record.get('newItem')) {
                                removeItem();
                                return true;
                            }

                            GibsonOS.Ajax.request({
                                url: url,
                                method: 'DELETE',
                                params: {
                                    projectId: record.get('projectId'),
                                    localPath: record.get('localPath')
                                },
                                success: removeItem
                            });
                        }
                    },{
                        text: 'Nein'
                    }]
                })
            }
        }];

        this.callParent();

        this.on('selectionchange', function(selectionModel, nodes, options) {
            var addButton = tree.down('#ahoiProjectTreeAddPageButton');
            var deleteButton = tree.down('#ahoiProjectTreeDeleteButton');

            if (!nodes.length) {
                addButton.disable();
                deleteButton.disable();
                return true;
            }

            var node = nodes[0];

            if (
                node.get('type') === 'layout' ||
                node.get('type') === 'page'
            ) {
                addButton.enable();
            } else {
                addButton.disable();
            }

            if (
                node.get('type') === 'project' ||
                node.get('type') === 'partial' ||
                node.get('type') === 'page'
            ) {
                deleteButton.enable();
            } else {
                deleteButton.disable();
            }
        });
    }
});