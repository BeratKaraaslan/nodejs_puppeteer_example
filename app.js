// const {
//     text
// } = require("body-parser");
// const puppeteer = require("puppeteer")

// const ITEM_URL = "https://airdrops.io/hot/"

// const deneme = async () => {
//     const browser = await puppeteer.launch({
//         headless: false
//     });


//     const page = await browser.newPage();
//     await page.setViewport({
//         width: 1920,
//         height: 1080
//     });

//     await page.goto(ITEM_URL, {
//         waitUntil: "networkidle2"
//     });

//     setTimeout(function () {
//         page.click("#onesignal-slidedown-cancel-button");
//     }, 4000);

//     // setTimeout(()=>{
//     //     while (5){
//     //         setTimeout(()=>{
//     //             page.click(".showmore")
//     //         }, 1000);

//     //     }
//     // }, 5000);


//     // for (let i=0; i<5; i++){
//     //     console.log(i)
//     // await setTimeout(()=>{
//     //     page.click(".showmore")
//     // },1000);
//     // }

//     const whileLoop = (async () => {
//         console.log('Start')
//         while (true) {

//             await page.click(".showmore")
//         }
//         console.log('End')
//     });

//     setTimeout(async () => {
//         await whileLoop()
//     }, 5000)


//     // let list = await page.evaluate(() => {
//     //     let elements = Array.from(document.querySelectorAll("div.air-content-front"));
//     //     let links = elements.map(element => {
//     //         return element.textContent
//     //     })
//     //     return links;
//     // }).then(setTimeout(()=>{
//     //     console.log(list);
//     // },6000))







//     //     let textList = [];
//     //     let ihs = [];


//     //     setTimeout(async()=>{
//     //          textList = await page.evaluate(() => {
//     //             let allList = document.querySelectorAll("div.air-content-front");
//     //             allList.forEach((element) => {
//     //                 // would rather not use this
//     //             ihs.push(element.innerHTML);
//     //         });
//     //         return textList
//     //     })
//     // },4000)

//     //     setTimeout(async()=>{
//     //     console.log(ihs);

//     //     },6000)


//     // setTimeout(function(){
//     //     let list = page.$eval(
//     //         "div.air-content-front",
//     //         (Element) => Element.innerHTML
//     //         );-
//     //         browser.close();
//     //         return list.then(console.log);

//     // },6000);


//     // await page.waitForNavigation();


//     // await page.type(".search-field", "airdrop");

//     // await page.click(".ac_results")





// }

// deneme().then(console.log)


const puppeteer = require("puppeteer");





(async () => {

    console.info('Test started.');

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

    async function showmore() {

        const cssSelector = '.showmore span';
        const isElementVisible = async (page, cssSelector) => {
            let visible = true;
            await page
                .waitForSelector(cssSelector, {
                    visible: true,
                    timeout: 4000
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
        };
    }

    //scrraping işleminin yapılacağı fonksiyon
    async function scrappingCard() {
        console.log('functions is started');

        try {

            var airdropList = await page.evaluate(() => {

                console.log('airdropList içinde');
                ///airdropList i oluştur
                var list = [];

                ///airdrop ların listesini çek ve liste oluştur.
                let cards = Array.from(document.querySelectorAll('div.container div.air-content-front h3'));
                let all = Array.from(document.querySelectorAll('.air-thumbnail img'));
                let airdrop = all.map(c => c.getAttribute('src'));
                let allUrl = Array.from(document.querySelectorAll('div.air-content-front a[href^="https://airdrops"]'));
                let airdropUrl = allUrl.map(c => c.getAttribute('href'));
                if (cards.length != 0) {

                    ///Çekilen listeyi list'e ata.
                    for (let index = 0; index < cards.length; index++) {
                        list.push({
                            title: cards[index].innerText,
                            urlpng: airdrop[index],
                            url: airdropUrl[index],

                        });
                    }
                }
                return list;
            });



            ///Listeyi yazdıran döngü
            for (let index = 0; index < airdropList.length; index++) {
                console.log("Name: " + airdropList[index].title + " Url: " + airdropList[index].url + " Png: " + airdropList[index].urlpng);
            }
            console.log('functions is finished ' + airdropList.length);


            return airdropList.length;

        } catch (error) {
            console.log(error);
            await browser.close();
        }

    }

    async function description(ind) {

        console.log('functions is started');


        let airdropList = await page.evaluate(async () => {

            console.log('airdropList içinde');
            ///list oluştur
            let list = [];

            ///airdrop URL leri çek ve liste oluştur.
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
        console.log('functions is finished ' + airdropList.length);
        let descList = [];

        await page.goto(airdropList[ind].url, {
            waitUntil: 'networkidle0'
        });

        
        let wp = await page.$eval('.download-whitepaper', Element => Element.href);

        if(wp!=null){

            descList.push({
                whitepaper: wp,
            });
            console.log(descList)
        }
        return descList;


    }

    async function* asyncGenerator() {
        let i = 0;
        while (i < 3) {
          yield i++;
        }
      }


    try {
        await showmore()
        await scrappingCard();
        for await (const num of asyncGenerator()){
            await description(num);
        };
        await browser.close();
    } catch (error) {
        console.log(error);
        await browser.close();
    }


})();