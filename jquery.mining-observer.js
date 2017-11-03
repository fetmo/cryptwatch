
$.fn.miningObserver = function () {
    var miningObserver = function () {
        var pH = {
            'nanopool': 'https://api.nanopool.org/v1/',
            'zenmine': 'https://zenmine.pro/api/accounts/',
            'nicehash': 'https://api.nicehash.com/api',
            'siamining': 'https://siamining.com/api/v1/addresses/'
        };

        return {
            options: {
                'currencySelector': '.crypto-template-select-currency',
                'addressSelector': '.crypto-template-wallet-box',
                'containerSelector': '.crypto-mining-container',
                'saveSelector': '.crypto-template-save'
            },

            init: function (elem) {
                var me = this;
                me._$container = elem;

                me._$miningContainer = $(me.options.containerSelector);
                me._$address = $(me.options.addressSelector, me._$container);
                me._$currency = $(me.options.currencySelector, me._$container);
                me._$save = $(me.options.saveSelector, me._$container);

                me._storage = window.localStorage;

                me.loadFromStorage();

                me._$save.on('click', $.proxy(me.onClick, me));
            },

            onClick: function (event) {
                var me = this,
                    url = '',
                    address = me._$address.val(),
                    currencyPool = me._$currency.val(),
                    currency = currencyPool.split('-')[1],
                    pool = currencyPool.split('-')[0];

                switch (pool) {
                    case 'nanopool':
                        url = me.createApiUrlNanopool(address, currency);
                        break;
                    case 'zenmine':
                        url = me.createApiUrlZenmine(address, currency);
                        break;
                    case 'nicehash':
                        url = me.createApiUrlNicehash(address, currency);
                        break;
                    case 'siamining':
                        url = me.createApiUrlSiamining(address, currency);
                        break;
                    default:
                        url = '';
                        break;
                }

                if (url !== '') {
                    me.saveToStorage(address, url, pool, currency);
                    me.createMiningTicker(url, pool, currency);
                    me._$address.val('');
                }
            },

            createMiningTicker: function (url, pool, currency) {
                var me = this,
                    element = $(window.miningContainer);

                element.attr('data-url', url);
                element.attr('data-pool', pool);
                element.attr('data-currency', currency);

                me._$miningContainer.append(element);
                element.miningTicker();
            },

            createApiUrlNanopool: function (address, currency) {
                var me = this;

                return pH.nanopool + currency.toLowerCase() + '/balance_hashrate/' + address;
            },

            createApiUrlZenmine: function (address, currency) {
                var me = this;

                return pH.zenmine + address;
            },

            createApiUrlNicehash: function (address, currency) {
                var me = this;

                return 'call.php?url=' + encodeURI(pH.nicehash + '?method=stats.provider&addr=' + address);
            },

            createApiUrlSiamining: function (address, currency) {
                var me = this;

                return 'call.php?url=' + encodeURI(pH.siamining + address);
            },

            saveToStorage: function (address, url, pool, currency) {
                var me = this,
                    miningWallets = me._storage.getItem('mining-wallets') || {};

                if (typeof miningWallets !== 'object') {
                    miningWallets = JSON.parse(miningWallets);
                }

                miningWallets[address + pool] = {
                    url: url,
                    pool: pool,
                    currency: currency
                };

                me._storage.setItem('mining-wallets', JSON.stringify(miningWallets));
            },

            loadFromStorage: function () {
                var me = this,
                    miningWallets = me._storage.getItem('mining-wallets') || '';

                if(miningWallets !== ''){
                    miningWallets = JSON.parse(miningWallets);

                    Object.getOwnPropertyNames(miningWallets).forEach(function (key) {
                        var set = miningWallets[key];

                        me.createMiningTicker(set.url, set.pool, set.currency);
                    });
                }
            }
        }
    };

    return this.each(function () {
        var cT = new miningObserver();
        cT.init($(this));
    });
};