import {getCookie} from "@/utils/cookie"
import {apiFetchHandler} from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"

export async function POST(req: Request) {
    const requestData = await req.json();
    const accessToken = await getCookie('accessToken');
    
    if(accessToken == null) return
    
    return await apiFetchHandler('http://localhost:8080/api/records', HttpMethod.POST, requestData, accessToken);
}
