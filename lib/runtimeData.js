const runtimeData = (function () {

    return {

        // Basic information.
        companyName: "KozlovDev",
        productName: "MainWorld",
        productVersion: "0.1",
        sdkVersion: "3.13.2",
        productDescription: "",

        // File references.
        buildURL: "bin",
        loaderURL: "bin/Web_YandexGames_temp.loader.js",
        dataURL: "bin/Web_YandexGames_temp.data.br",
        frameworkURL: "bin/Web_YandexGames_temp.framework.js.br",
        workerURL: "",
        codeURL: "bin/Web_YandexGames_temp.wasm.br",
        symbolsURL: "",
        streamingURL: "streaming",

        // Aspect ratio.
        desktopAspectRatio: -1,
        mobileAspectRatio: -1,

        // Debug mode.
        debugMode: false,

        // Platform specific scripts.
        wrapperScript: "yandexGamesWrapper.js",
        gameDistributionId: "",
        gameDistributionPrefix: "mirragames_",

    }

})();