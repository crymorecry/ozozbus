import { NextResponse } from 'next/server';
import { read, utils } from 'xlsx';

export async function POST(req: Request){
    const formData = await req.formData();
    const id_tovar = formData.get('id_tovar') as string;
    const reportFile = formData.get('report') as File;
    const costsFile = formData.get('costs') as File;
    
    const bytes = await reportFile.arrayBuffer();
    const reportBuffer  = Buffer.from(bytes)
    const reportWorkbook = read(reportBuffer);
    const reportSheet = reportWorkbook.Sheets[reportWorkbook.SheetNames[0]];

    let totalSum = 0;
    let count = 0;
    if(reportSheet['!ref']){
        const number = (reportSheet['!ref'].split(':')[1]).substring(1)
        for (let i = 1; i <= parseInt(number, 10); i++) {
            const cellValue = reportSheet[`F${i}`]?.v;
            if (cellValue === id_tovar) {
                const sumCellValue = reportSheet[`J${i}`]?.v; 
                if (sumCellValue) {
                totalSum += sumCellValue;
                count++;
                }
            }
        }
        const records = new Map<string, number>();
    
        // Проходим по всем строкам и считаем количество записей для каждой уникальной даты
        for (let i = 2; ; i++) {
          const cellDate = utils.format_cell(reportSheet[`A${i}`]); // Предполагаем, что даты находятся в столбце A
          if (!cellDate) break; // Если достигли пустой ячейки, выходим из цикла
          records.set(cellDate, (records.get(cellDate) || 0) + 1); // Увеличиваем счетчик для каждой даты
        }
    
        // Преобразуем Map в массив для вывода
        const recordsArray = Array.from(records.entries()).map(([date, count]) => ({ date, count }));
        const bytes1 = await costsFile.arrayBuffer();
        const costsBuffer  = Buffer.from(bytes1)
        const costsWorkbook = read(costsBuffer);
        const costsSheet = costsWorkbook.Sheets[costsWorkbook.SheetNames[0]];
        if(costsSheet['!ref']){
            const number_costs = (costsSheet['!ref'].split(':')[1]).substring(1)
            let costs_tovar;
            for (let i = 1; i <= parseInt(number_costs, 10); i++) {
                const cellValue = costsSheet[`C${i}`]?.v;
                if (cellValue === parseInt(id_tovar,10)) {
                    costs_tovar = costsSheet[`B${i}`]?.v;
                    break;
                }
            }

            const raz = totalSum - parseInt(costs_tovar,10)*count;

            return NextResponse.json({totalSum:totalSum,count:count,raz:raz,recordsArray:recordsArray,all_tovar:parseInt(number,10)})
        }
        return NextResponse.json({error:"error"})
    }else{
        return NextResponse.json({error:"error"})
    }
}