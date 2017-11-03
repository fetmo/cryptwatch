
$.fn.cryptoTicker = function () {
    var cryptoTicker = function () {
        return {
            _oldValue: 0,

            options: {
                'currency': 'BTC',
                'currencySelector': '.crypt-currency-input',
                'fiatUSDSelector': '.crypt-currency-usd-value',
                'fiatEURSelector': '.crypt-currency-eur-value',
                'fiatBTCSelector': '.crypt-currency-btc-value',
                'baseUrl': 'https://min-api.cryptocompare.com/data/price'
            },

            init: function (elem) {
                var me = this;
                me._$container = elem;
                me.applyDataAttributes();

                me._$container.data('plugin-ticker', me);

                me._$usd = $(me.options.fiatUSDSelector, me._$container);
                me._$eur = $(me.options.fiatEURSelector, me._$container);
                me._$btc = $(me.options.fiatBTCSelector, me._$container);

                me._$input = $(me.options.currencySelector, me._$container);

                me._$input.on('change', $.proxy(me.onChange, me));

                setInterval($.proxy(me.refresh, me), 30000);
                me.refresh();
            },

            onChange: function (event) {
                var me = this,
                    params = '?';

                me._oldValue = me._$input.val();

                params += 'fsym=' + me.options.currency;
                params += '&tsyms=USD,EUR,BTC';

                $.ajax(me.options.baseUrl + params, {
                    type: 'GET',
                    success: $.proxy(me.renderPrice, me)
                });
            },

            refresh: function () {
                var me = this;

                if (me._$input.val() !== '') {
                    me._$input.trigger('change');
                }
            },

            renderPrice: function (response) {
                var me = this,
                    counter = me._$input.val();

                if (typeof response.Type === 'undefined') {
                    me._$usd.text((response.USD * counter).toFixed(5).toString().replace(/0+$/, '') + ' $');
                    me._$eur.text((response.EUR * counter).toFixed(5).toString().replace(/0+$/, '') + ' €');
                    me._$btc.text((response.BTC * counter).toFixed(5).toString().replace(/0+$/, '') + ' B');
                }
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
        var cT = new cryptoTicker();
        cT.init($(this));
    });
};