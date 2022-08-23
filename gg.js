const puppeteer = require("puppeteer");

(async () => {

    console.info('Test started.');
    const browser = await puppeteer.launch({
        headless: false, // Botu çalıştırırken chrome un açılıp açılmayacağının kontrolü.

    });

    //Tarayıcıda yeni sekme açıldı.
    const page = await browser.newPage();

    //Açılacak olan ekranın ölçüleri manuel girildi.
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    
    var descList = [];

    //scrraping işleminin yapılacağı fonksiyon
    async function description(ind) {

        ///Target URL
        const url = 'https://airdrops.io/hot/';
        //Adrese git
        await page.goto(url, {
            waitUntil: 'networkidle0'
        });
        console.log('functions is started');


        var airdropList = await page.evaluate(() => {
            console.log('airdropList içinde');
            ///airdropList i oluştur
            var list = [];

            ///airdrop ların listesini çek ve liste oluştur.
            let allUrl = Array.from(document.querySelectorAll('div.air-content-front a[href^="https://airdrops"]'));
            let airdropUrl = allUrl.map(c => c.getAttribute('href'));
            if (airdropUrl.length != 0) {

                ///Çekilen listeyi list'e ata.
                for (let index = 0; index < airdropUrl.length; index++) {
                    list.push({
                        url: airdropUrl[index],
                    });
                }
            }
            return list;
        });

        // for (let index = 0; index < airdropList.length; index++) {
        //     console.log(airdropList[index].url);
        // }
        console.log('functions is finished ' + airdropList[ind].url);
 
        // airdropList'teki url'e git
        await page.goto(airdropList[ind + 9].url, {
            waitUntil: 'networkidle0'
        });

        page.waitForNavigation()

        // sayfada ki wallpaper'ı al decList'e ata
        var wp = await page.$eval('.download-whitepaper', Element => Element.href);

        console.log('-------->' + wp);

        descList.push({
            whitepaper: wp
        });

        console.log(descList)
        await page.goBack();
        return descList;


    }


    //  forawait fonksiyonu kadar description fonksiyonunu döndür.
    async function* forawait() {
        let i = 0;
        while (i < 20) {
            yield i++;
        }
    }



    try {
        for await (const num of forawait()) {
            try {
                await description(num);
            } catch (error) {
                await description(num + 1);

                continue;
            }
        };
        await browser.close();
    } catch (error) {
        console.log(error);
        await browser.close();
    }
})();