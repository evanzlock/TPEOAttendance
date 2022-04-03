//example json
//name: Derek Wu
//code: 2532
if (form.code == password) {
    //loop through members list to find match and update
    const members = async () => {
        const payload = {
            path: `databases/${databaseMemberId}/query`,
            method: 'POST'
        }

        const { results } = await notion.request(payload)
        //console.log(results);

        const id = results.find(page => {
            return page.properties.Name.title[0].text.content == form.name
        }).id
    }
}