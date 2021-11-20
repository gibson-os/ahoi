Ext.define('GibsonOS.module.ahoi.project.store.Tree', {
    extend: 'GibsonOS.data.TreeStore',
    alias: ['store.gosModuleAhoiProjectTreeStore'],
    model: 'GibsonOS.module.ahoi.project.model.Tree',
    autoLoad: true,
    proxy: {
        type: 'gosDataProxyAjax',
        url: baseDir + 'ahoi/project/index'
    }
});