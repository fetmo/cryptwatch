jQuery(document).ready(function ($) {
    window.Wallet.init();

    $('*[data-mining-observer="true"]').miningObserver();
    $('*[data-wallet-observer="true"]').walletObserver();
    $('*[data-amount-ticker="true"]').cryptoAmountTicker();
});

