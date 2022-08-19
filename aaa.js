const puppeteer = require("puppeteer");
(async () => {

    const browser = await puppeteer.launch({
        headless: true, // Botu çalıştırırken chrome un açılıp açılmayacağının kontrolü.

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



    async function scrappingCard() {
        console.info('Test started.');
        try {

            let airdropName = await page.evaluate(() => {

                console.info("listenin içinde");

                let list = [];

                let allUrl = Array.from(document.querySelectorAll('div.air-content-front a[href^="https://airdrops"]'));
                let airdropUrl = allUrl.map(c => c.getAttribute('href'));

                console.log(airdropUrl);

                if (allUrl != 0) {
                    for (let i = 0; i > allUrl.length; i++) {
                        list.push({
                            title: airdropUrl[i],
                        });
                    }
                }
                return list
            });

            console.log('functions is finished ' + airdropName.length);

            for (let index = 0; index < airdropName.length; index++) {
                console.log(airdropName[index].title);
            }

        } catch (error){
            console.log(error)
        }
    }
    try {
        await scrappingCard();
        await browser.close();
    } catch (error) {
        console.log(error);
        await browser.close();
    }
})();

function waitUntil(t) {
    return new Promise((r) => {
        setTimeout(r, t)
    })
}