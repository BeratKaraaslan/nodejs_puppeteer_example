const puppeteer = require("puppeteer");


(async () => {

    const browser = await puppeteer.launch({
        headless: false, // Botu çalıştırırken chrome un açılıp açılmayacağının kontrolü.

    });

    //Tarayıcıda yeni sekme açıldı. (Mutlaka yapılması gerekmektedir)
    const page = await browser.newPage();

    //Açılacak olan ekranın ölçüleri manuel girildi.
    await page.setViewport({
        width: 1920,
        height: 1080
    });

    ///Target URL
    const url = 'https://airdrops.io/hot';

    //Adrese git
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });


    
    
    const cssSelector = '.showmore span';
    const isElementVisible = async (page, cssSelector) => {
        let visible = true;
        await page
            .waitForSelector(cssSelector, {
                visible: true,
                timeout: 2000
            })
            .catch(() => {
                visible = false;
            });
        return visible;
    };



    let loadMoreVisible = await isElementVisible(page, '.showmore span');
    while (loadMoreVisible) {
        await page
            .click('.showmore span')
            .catch(() => {});
        loadMoreVisible = await isElementVisible(page, '.showmore span');
    }

})();