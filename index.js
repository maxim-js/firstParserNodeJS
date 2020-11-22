const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
let link = 'https://www.muztorg.ru/category/klassicheskie-gitary?in-stock=1&pre-order=1&page='

const parse = async () => {
    try {
        let arr = []
        let i = 1
        let flag = false

        while (true) {
            console.log('step - ', i);
            await axios.get(link + i)
                .then(res => res.data)
                .then(res => {
                    let html = res
                    $ = cheerio.load(html)
                    let pagination = $('li.next.disabled').html()
                    $(html).find('section.product-thumbnail').each((index, element) => {
                        let item = {
                            price: $(element).find('p.price').text().replace(/\s+/g, ''),
                            name: $(element).find('div.product-header').text().trim(),
                            img: $(element).find('img.img-responsive').attr('data-src')

                        }

                        arr.push(item)
                    })

                    if (pagination !== null) {
                        flag = true
                    }
                })
                .catch(err => console.log(err))



            if (flag) {
                console.log(("All items= ", arr.length));
                fs.writeFile('muztorg.json', JSON.stringify(arr), function (err) {
                    if (err) throw err
                    console.log('Saved muztorg.json');
                })
                break
            }
            i++
        }
    } catch (e) {
        console.log('err - ', e);
    }
}

parse()