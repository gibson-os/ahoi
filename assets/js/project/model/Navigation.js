Ext.define('GibsonOS.module.ahoi.project.model.Navigation', {
    extend: 'GibsonOS.data.Model',
    fields: [{
        name: 'itemId',
        type: 'string'
    },{
        name: 'startDepth',
        type: 'int'
    },{
        name: 'depth',
        type: 'int'
    }]
});