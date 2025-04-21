import React, {useEffect, useState} from 'react'
import HttpMethod from "@/enums/HttpMethod"
import {RecordGroup} from "../../../../generated/common"

const RecordGroups = () => {
    const [recordGroups, setRecordGroups] = useState<RecordGroup[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        const fetchRecordGroups = async () => {
            try {
                const res = await fetch('/api/recordGroups', {method: HttpMethod.GET});
                
                const data = await res.json()
                
                if (data != null) {
                    setRecordGroups(data.groups) // 데이터를 state에 저장
                }
            } catch (error) {
                console.error('Error fetching record groups:', error)
                setError('Error fetching record groups')
            } finally {
                setLoading(false)
            }
        }
        
        fetchRecordGroups()
    }, [])
    
    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!Array.isArray(recordGroups)) {
        return <div></div>
    }
    
    return (
        <div>
            <ul className={"record-group-ul"}>
                {
                    recordGroups?.map((group: RecordGroup) => (
                        <li key={group.id}>
                            <span className={"left-label"} style={{background: `linear-gradient(to right, ${group.color} 4px, transparent 4px)`}}></span>
                            {group.title}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default RecordGroups
