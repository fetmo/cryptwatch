$.fn.walletObserver = function () {
    var walletObserver = function () {
        var pH = {
            'ETH': 'https://ethplorer.io/service/service.php?data=',
            'ZEC': 'https://api.zcha.in/v2/mainnet/accounts/',
            'ZEN': 'https://explorer.zen-solutions.io/api/addr/',
            'DASH': 'https://api.blockcypher.com/v1/dash/main/addrs/',
            'BTC': 'https://api.blockcypher.com/v1/btc/main/addrs/',
            'SC': 'https://explorer.siahub.info/api/hash/',
            'LTC': 'https://api.blockcypher.com/v1/ltc/main/addrs/',
            'LSK': 'https://explorer.lisk.io/api/getAccount?address='
        };

        return {
            options: {
                'currencySelector': '.crypto-template-select-box',
                'addressSelector': '.crypto-template-wallet-box',
                'containerSelector': '.crypto-wallet-container',
                'saveSelector': '.crypto-template-save'
            },

            init: function (elem) {
                var me = this;
                me._$container = elem;

                me._$walletContainer = $(me.options.containerSelector);
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
                    currency = me._$currency.val();

                switch (currency) {
                    case 'ETH':
                        url = me.createApiUrlETH(address, currency);
                        break;
                    case 'DASH':
                        url = me.createApiUrlDASH(address, currency);
                        break;
                    case 'BTC':
                        url = me.createApiUrlBTC(address, currency);
                        break;
                    case 'SC':
                        url = me.createApiUrlSC(address, currency);
                        break;
                    case 'ZEC':
                        url = me.createApiUrlZEC(address, currency);
                        break;
                    case 'ZEN':
                        url = me.createApiUrlZEN(address, currency);
                        break;
                    case 'LTC':
                        url = me.createApiUrlLTC(address, currency);
                        break;
                    case 'LSK':
                        url = me.createApiUrlLSK(address, currency);
                        break;
                    default:
                        url = '';
                        break;
                }

                if (url !== '') {
                    me.saveToStorage(address, url, currency);
                    me.createWalletTicker(url, currency);
                    me._$address.val('');
                }
            },

            createWalletTicker: function (url, currency, key) {
                var me = this,
                    element = $(window.walletContainer);

                element.attr('data-url', url);
                element.attr('data-currency', currency);
                element.attr('data-key', key);

                me._$walletContainer.append(element);
                element.walletTicker();
            },

            createApiUrlETH: function (address, currency) {
                var me = this;

                return 'call.php?url=' + encodeURI(pH.ETH + address);
            },

            createApiUrlDASH: function (address, currency) {
                var me = this;

                return pH.DASH + address + '/balance';
            },

            createApiUrlBTC: function (address, currency) {
                var me = this;

                return pH.BTC + address + '/balance';
            },

            createApiUrlSC: function (address, currency) {
                var me = this;

                return 'call.php?url=' + encodeURI(pH.SC + address);
            },

            createApiUrlZEC: function (address, currency) {
                var me = this;

                return 'call.php?url=' + encodeURI(pH.ZEC + address);
            },

            createApiUrlZEN: function (address, currency) {
                var me = this;

                return 'call.php?url=' + encodeURI(pH.ZEN + address);
            },

            createApiUrlLTC: function (address, currency) {
                var me = this;

                return pH.LTC + address + '/balance';
            },

            createApiUrlLSK: function (address, currency) {
                var me = this;

                return pH.LSK + address;
            },

            saveToStorage: function (address, url, currency) {
                var me = this,
                    walletWallets = me._storage.getItem('wallet-wallets') || {};

                if (typeof walletWallets !== 'object') {
                    walletWallets = JSON.parse(walletWallets);
                }

                walletWallets[address + currency] = {
                    url: url,
                    currency: currency
                };

                me._storage.setItem('wallet-wallets', JSON.stringify(walletWallets));
            },

            loadFromStorage: function () {
                var me = this,
                    walletWallets = me._storage.getItem('wallet-wallets') || '';

                if (walletWallets !== '') {
                    walletWallets = JSON.parse(walletWallets);

                    Object.getOwnPropertyNames(walletWallets).forEach(function (key) {
                        var set = walletWallets[key];

                        me.createWalletTicker(set.url, set.currency, key);
                    });
                }
            }
        }
    };

    return this.each(function () {
        var cT = new walletObserver();
        cT.init($(this));
    });
};