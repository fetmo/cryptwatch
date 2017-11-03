var wallet = function () {
    return {
        options: {
            'fiatUSDSelector': '.crypt-currency-usd-value',
            'fiatEURSelector': '.crypt-currency-eur-value',
            'fiatBTCSelector': '.crypt-currency-btc-value',
            'baseUrl': 'https://min-api.cryptocompare.com/data/price'
        },

        wallets: [],

        init: function () {
            var me = this;

            me._$container = $(window.walletTemplate);

            me._$usd = $(me.options.fiatUSDSelector, me._$container);
            me._$eur = $(me.options.fiatEURSelector, me._$container);
            me._$btc = $(me.options.fiatBTCSelector, me._$container);

            $('body').append(me._$container);

            setInterval($.proxy(me.refresh, me), 10000);
        },

        add: function (wallet) {
            var me = this;

            me.wallets.push(wallet);
            me.refresh();
        },

        calculate: function () {
            var me = this, usd = 0, eur = 0, btc = 0;

            me.wallets.forEach(function (wallet) {
                var ticker = wallet.data('plugin-ticker'),
                    usdText = ticker._$usd.text(),
                    eurText = ticker._$eur.text(),
                    btcText = ticker._$btc.text();

                usd += Number(usdText.substr(0, usdText.length - 2));
                eur += Number(eurText.substr(0, eurText.length - 2));
                btc += Number(btcText.substr(0, btcText.length - 2));
            });

            me.renderPrice(usd, eur, btc)
        },

        refresh: function () {
            var me = this;

            me.calculate();
        },

        renderPrice: function (usd, eur, btc) {
            var me = this;

            me._$usd.text(Number(usd).toFixed(3).toString().replace(/0+$/, '') + ' $');
            me._$eur.text(Number(eur).toFixed(3).toString().replace(/0+$/, '') + ' €');
            me._$btc.text(Number(btc).toFixed(3).toString().replace(/0+$/, '') + ' B');
        }
    }
};

window.Wallet = new wallet();

$.fn.wallet = function () {
    return this.each(function () {
        window.Wallet.add($(this));
    });
};