Ext.define('GibsonOS.module.ahoi.project.model.Tree', {
    extend: 'GibsonOS.data.Model',
    fields: [{
        name: 'id',
        type: 'string'
    },{
        name: 'projectId',
        type: 'int'
    },{
        name: 'text',
        type: 'string'
    },{
        name: 'name',
        type: 'string'
    },{
        name: 'type',
        type: 'string'
    },{
        name: 'iconCls',
        type: 'string'
    },{
        name: 'localPath',
        type: 'string'
    },{
        name: 'transferSessionId',
        type: 'int'
    },{
        name: 'remotePath',
        type: 'string'
    },{
        name: 'partial',
        type: 'string'
    },{
        name: 'title',
        type: 'string'
    },{
        name: 'template',
        type: 'string'
    },{
        name: 'url',
        type: 'string'
    },{
        name: 'contentItemId',
        type: 'string'
    },{
        name: 'navigation',
        type: 'array'
    }, {
        name: 'onlyForThisUser',
        type: 'bool'
    },{
        name: 'newItem',
        type: 'bool'
    }]
});