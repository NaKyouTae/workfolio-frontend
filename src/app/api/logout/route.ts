import {getCookie} from "@/utils/cookie"
import {apiFetchHandler} from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"

export async function GET() {
    const accessToken = await getCookie('accessToken');
    
    if(accessToken == null) return
    
    return await apiFetchHandler('http://localhost:8080/api/logout', HttpMethod.GET, undefined, accessToken);
}
