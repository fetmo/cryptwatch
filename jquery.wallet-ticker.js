$.fn.walletTicker = function () {
    var walletTicker = function () {
        return {
            options: {
                'currency': 'BTC',
                'url': '',
                'currencySelector': '.crypt-currency-input',
                'containerSelector': '.crypto-wallet-container',
                'titleSelector': '.crypto-currency-title',
                'key': ''
            },

            init: function (elem) {
                var me = this;
                me._$container = elem;
                me.applyDataAttributes();

                me._$input = $(me.options.currencySelector, me._$container);
                me._$title = $(me.options.titleSelector, me._$container);
                me._$walletContainer = $(me.options.containerSelector);

                me._$title.html('Wallet ' + me.options.currency + ' <span class="crypto-wallet-clear">X</span>');
                me._$delete = $('.crypto-wallet-clear', me._$title);

                me._$delete.on('click', $.proxy(me.deleteElement, me));

                me.callApi();

                setInterval($.proxy(me.callApi, me), 120000);
            },

            deleteElement: function () {
                var me = this;


            },

            clearFromStorage: function (key) {
                var me = this,
                    walletWallets = me._storage.getItem('wallet-wallets') || '';

                if (walletWallets !== '') {
                    walletWallets = JSON.parse(walletWallets);

                    Object.getOwnPropertyNames(walletWallets).forEach(function (index) {
                        if(index === key){
                            walletWallets[index] = null;
                        }
                    });

                    me._storage.setItem('wallet-wallets', JSON.stringify(walletWallets));
                }
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

                switch (me.options.currency) {
                    case 'ETH':
                        me.renderETH(response);
                        break;
                    case 'DASH':
                        me.renderDASH(response);
                        break;
                    case 'BTC':
                        me.renderBTC(response);
                        break;
                    case 'SC':
                        me.renderSC(response);
                        break;
                    case 'ZEC':
                        me.renderZEC(response);
                        break;
                    case 'ZEN':
                        me.renderZEN(response);
                        break;
                    case 'LTC':
                        me.renderLTC(response);
                        break;
                    case 'LSK':
                        me.renderLSK(response);
                        break;
                    default:
                        break;
                }
            },

            triggerTicker: function (elem) {
                var me = this;

                if (typeof elem.data('plugin-ticker') === 'undefined') {
                    elem.cryptoTicker();
                    elem.wallet();
                }
            },

            renderETH: function (response) {
                var me = this;

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                me._$input.val(response.balance);
                me.triggerTicker(me._$container);

                me.renderETHToken(response);
            },

            renderETHToken: function (response) {
                var me = this,
                    token = response.balances,
                    walletContainer = $(me.options.containerSelector),
                    formatted = [];

                token.forEach(function (p1) {
                    var contract = response.tokens[p1.contract];

                    formatted.push({
                        'address': contract.address,
                        'currency': contract.symbol,
                        'balance': Number(p1.balance / Math.pow(10, Number(contract.decimals))).toFixed(5)
                    });
                });

                formatted.forEach(function (f1) {
                    var element = $('*[data-address="' + f1.address + '"]', walletContainer), newEl = false;

                    if (element.length === 0) {
                        element = $(window.currencyCryptoContainer);
                        element.attr('data-currency', f1.currency);
                        element.attr('data-address', f1.address);

                        var title = $(me.options.titleSelector, element);
                        title.text('Wallet ' + f1.currency);

                        newEl = true;
                    }

                    var input = $(me.options.currencySelector, element);
                    input.val(f1.balance);

                    if (newEl) {
                        me._$walletContainer.append(element);
                        me.triggerTicker(element);
                    } else {
                        input.trigger('change');
                    }
                });
            },

            renderDASH: function (response) {
                var me = this, balance = response.balance;

                balance = (balance / Math.pow(10, 8)).toFixed(5);
                me._$input.val(balance);
                me.triggerTicker(me._$container);
            },

            renderBTC: function (response) {
                var me = this, balance = response.balance;

                balance = (balance / Math.pow(10, 8)).toFixed(5);
                me._$input.val(balance);
                me.triggerTicker(me._$container);
            },

            renderSC: function (response) {
                var me = this,
                    balance = 0.0,
                    data = [];

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                response.blocks.forEach(function (block) {
                    data.push(block.height);
                });

                $.ajax('https://explorer.siahub.info/api/blocks/', {
                    type: 'POST',
                    data: {
                        'blocks': data,
                        'hash': response.hash,
                        'type': 'unlockhash'
                    },
                    success: function (bResponse) {
                        Object.getOwnPropertyNames(bResponse).forEach(function (block) {
                            var bresTransactions = bResponse[block].transactions;
                            Object.getOwnPropertyNames(bresTransactions).forEach(function (transactionID) {
                                var siacoinoutputs = bresTransactions[transactionID].siacoinoutputs;
                                Object.getOwnPropertyNames(siacoinoutputs).forEach(function (siacoinoutputID) {
                                    var siacoinoutput = siacoinoutputs[siacoinoutputID];
                                    balance += Number(siacoinoutput.value);
                                });
                            });
                        });

                        balance = (balance / Math.pow(10, 24)).toFixed(5);

                        me._$input.val(balance);
                        me.triggerTicker(me._$container);
                    }
                })

            },

            renderZEC: function (response) {
                var me = this;

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                me._$input.val(response.balance);
                me.triggerTicker(me._$container);
            },

            renderZEN: function (response) {
                var me = this;

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                me._$input.val(response.balance);
                me.triggerTicker(me._$container);
            },

            renderLTC: function (response) {
                var me = this, balance = response.balance;

                balance = (balance / Math.pow(10, 8)).toFixed(5);
                me._$input.val(balance);
                me.triggerTicker(me._$container);
            },

            renderLSK: function (response) {
                var me = this, balance = response.balance;

                balance = (balance / Math.pow(10, 8)).toFixed(5);
                me._$input.val(balance);
                me.triggerTicker(me._$container);
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
        var cT = new walletTicker();
        cT.init($(this));
    });
};