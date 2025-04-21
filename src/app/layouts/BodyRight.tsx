import React, {useEffect, useState} from 'react'
import MonthlyCalendar from "@/app/components/layout/MonthlyCalendar"
import HttpMethod from "@/enums/HttpMethod"
import {Record} from "../../../generated/common"

const BodyRight = () => {
    const [records, setRecords] = useState<Record[]>([])
    const today = new Date()
    
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch('/api/records', { method: HttpMethod.GET });
                
                const data = await res.json()
                
                if (data != null) {
                    setRecords(data.records); // 데이터를 state에 저장
                }
            } catch (error) {
                console.error('Error fetching records:', error)
            }
        }
        
        fetchRecords()
    }, [])
    
    return (
        <div>
            <MonthlyCalendar initialDate={today} records={records} />
        </div>
    );
};

export default BodyRight;
