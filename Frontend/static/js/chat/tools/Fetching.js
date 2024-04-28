

const Fetching = async (url,method, body) => {
    if(method === 'GET'){
    try{
        const response = await fetch(url)
        const data = await response.json()
        return data
    }
    catch(err){
        console.log(err);
    }}
    else if(method === 'POST'){
        try{
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'message': body
                })
            })
            const data = await response.json()
            console.log(data)
            return data
        }
        catch(err){
            console.log(err);
        }
    }
    
}  