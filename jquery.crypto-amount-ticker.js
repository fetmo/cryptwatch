
$.fn.cryptoAmountTicker = function () {
    var cryptoAmountTicker = function () {
        return {
            options: {
                'template': window.currencyCryptoContainer,
                'titleTemplateSelector': '.crypto-currency-title',
                'amountTemplateSelector': '.crypt-currency-input',
                'containerSelector': '.crypto-container',
                'selectSelector': '.crypto-template-select-box',
                'amountSelector': '.crypto-template-amount-box',
                'saveSelector': '.crypto-template-save'
            },

            init: function (elem) {
                var me = this;

                me._$container = $(elem);
                me._$select = $(me.options.selectSelector, me._$container);
                me._$amount = $(me.options.amountSelector, me._$container);
                me._$save = $(me.options.saveSelector, me._$container);

                me._storage = window.localStorage;

                me.loadFromStorage();

                me._$save.on('click', $.proxy(me.onSave, me));
            },

            onSave: function () {
                var me = this,
                    currency = me._$select.val(),
                    cAmount = me._$amount.val();

                me.createElement(currency, cAmount);
                me.saveToStorage(currency, cAmount);
                me._$amount.val('');
            },

            saveToStorage: function (c, a) {
                var me = this,
                    manWallets = me._storage.getItem('man-wallets') || {};

                if (typeof manWallets !== 'object') {
                    manWallets = JSON.parse(manWallets);
                }

                manWallets[c] = {
                    name: c,
                    amount: a
                };

                me._storage.setItem('man-wallets', JSON.stringify(manWallets));
            },

            createElement: function (cName, cAmount) {
                var me = this,
                    element = $(me.options.template),
                    title = $(me.options.titleTemplateSelector, element),
                    amount = $(me.options.amountTemplateSelector, element);

                title.text(cName);
                amount.val(cAmount.replace(',', '.'));
                element.attr('data-currency', cName);

                $(me.options.containerSelector).append(element);

                element.cryptoTicker();
            },

            loadFromStorage: function () {
                var me = this,
                    manWallets = me._storage.getItem('man-wallets') || '';

                if(manWallets !== ''){
                    manWallets = JSON.parse(manWallets);

                    Object.getOwnPropertyNames(manWallets).forEach(function (key) {
                        var set = manWallets[key];

                        me.createElement(set.name, set.amount);
                    });
                }
            }
        };
    };

    return this.each(function () {
        var cT = new cryptoAmountTicker();
        cT.init($(this));
    });
};