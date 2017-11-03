$.fn.miningTicker = function () {
    var miningTicker = function () {
        return {
            options: {
                'currency': 'ETH',
                'url': 'https://min-api.cryptocompare.com/data/price',
                'pool': 'nanopool',
                'titleSelector': '.crypto-mining-currency-title',
                'hashRateSelector': '.crypt-currency-hashrate',
                'balanceSelector': '.crypt-currency-balance'
            },

            init: function (elem) {
                var me = this;
                me._$container = elem;
                me.applyDataAttributes();

                me._$hashRate = $(me.options.hashRateSelector, me._$container);
                me._$balance = $(me.options.balanceSelector, me._$container);

                me._$title = $(me.options.titleSelector, me._$container);
                me._$title.text(me.options.currency + ' ' + me.options.pool);

                me._storage = window.localStorage;

                me.callApi();

                setInterval($.proxy(me.callApi, me), 90000);
            },

            callApi: function () {
                var me = this,
                    options = {
                        type: 'GET',
                        success: $.proxy(me.renderPrice, me)
                    };

                $.ajax(me.options.url, options);
            },

            renderPrice: function (response) {
                var me = this;

                switch (me.options.pool) {
                    case 'nanopool':
                        me.renderNanopool(response);
                        break;
                    case 'zenmine':
                        me.renderZenmine(response);
                        break;
                    case 'nicehash':
                        me.renderNicehash(response);
                        break;
                    case 'siamining':
                        me.renderSiamining(response);
                        break;
                    default :
                        break;
                }
            },

            renderNanopool: function (response) {
                var me = this, precision = (me.options.currency === 'SIA') ? 2 : 5;

                me._$balance.text(response.data.balance.toFixed(precision));
                me._$hashRate.text(response.data.hashrate + ((me.options.currency === 'ZEC') ? ' S/s' : ' MH/s'));
            },

            renderZenmine: function (response) {
                var me = this, immature = 0;

                response.rewards.forEach(function (reward) {
                    if(reward.immature){
                        immature += (reward.reward / Math.pow(10, 8));
                    }
                });

                me._$balance.html((response.stats.balance / Math.pow(10, 8)).toFixed(5) + '<br>' + immature.toFixed(5));
                me._$hashRate.text(response.currentHashrate.toFixed(5) + ' S/s');
            },

            renderNicehash: function (response) {
                var me = this, balance = 0.0, hashes = 'multiple Sources';

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                response.result.stats.forEach(function (miner) {
                    balance += Number(miner.balance);
                });

                me._$balance.text(balance.toFixed(6));
                me._$hashRate.text(hashes);
            },

            renderSiamining: function (response) {
                var me = this;

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                me._$balance.text(Number(response.balance).toFixed(2));
                me._$hashRate.text((Number(response.intervals[0].hash_rate) / Math.pow(10, 6)).toFixed(2) + ' MH/s');
            },

            applyDataAttributes: function () {
                var me = this;

                Object.getOwnPropertyNames(me.options).forEach(function (key) {
                    var dataVal = me._$container.attr('data-' + key);

                    if (dataVal) {
                        me.options[key] = dataVal;
                    }
                });
            }
        }
    };

    return this.each(function () {
        var cT = new miningTicker();
        cT.init($(this));
    });
};