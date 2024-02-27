'use client'
import ChartListens from '@/components/charts/page';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const inputReport = useRef<HTMLInputElement>(null);
  const inputCosts = useRef<HTMLInputElement>(null);
  const [id_tovar, SetIdTovar] = useState('')
  const [chart_bof,setChartBof] = useState(false)
  const [allTovar,setAllTovar] = useState(0)
  const [streams,setStreams] = useState<TypeTable[]>([])
  const [loadings, setLoading] = useState(false)
  const [totalSum,setTotalSum] = useState(0)
  const [raz,setRaz] = useState(0)
  const [count,setCount] = useState(0)
  type TypeTable = {
    date:string;
    count:number;
  }
  const [state, setState] = useState(1)
  const CheckReport = async() =>{
    if(inputReport.current?.files && inputCosts.current?.files && id_tovar){
      setLoading(true)
      setState(2)
      const report = inputReport.current.files[0];
      const costs = inputCosts.current.files[0];
      const formData = new FormData()
      formData.append('id_tovar', id_tovar);
      formData.append('report', report);
      formData.append('costs', costs);
      const res = await fetch('/api/check_report',{
        method:"POST",
        body: formData
      })
      const data = await res.json()
      setChartBof(true)
      setAllTovar(data.all_tovar)
      setStreams(data.recordsArray)
      setTotalSum(data.totalSum)
      setRaz(data.raz)
      setCount(data.count)
      setLoading(false)
    }
  }
  const dataListens = streams.map(item => (item.count !== 0 ? { name: item.date, uv: item.count } : null)).filter(item => item !== null);
  useEffect(() => {
    console.log(dataListens)
  }, [dataListens])
  return (
    <main className="flex justify-center py-32 px-8">
      {chart_bof ? (
        <div className='max-w-7xl w-full flex flex-col gap-y-8'>
          <div className='flex w-full justify-center'>
            <span className='text-3xl font-medium text-zinc-800'>Подсчёт наценки</span>
          </div>
          <div className='bg-[#fff] dark:bg-zinc-900 mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-md w-full p-4'>
            <div className='text-center'>
              <span className='text-lg font-medium text-zinc-800'>Отчет по товару: {id_tovar}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-base text-zinc-800'>Общая сумма проданного товара: {totalSum}</span>
              <span className='text-base text-zinc-800'>Количество проданного товара: {count}</span>
              <span className='text-base text-zinc-800'>Прибыль с проданного товара: {raz}</span>

            </div>
          </div>
          <div className='bg-[#fff] dark:bg-zinc-900 mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-md w-full'>
            <div className='flex flex-col gap-y-4'>
              <div className='flex px-8 py-4 '>
                <span className='text-lg font-medium text-zinc-800'>Всего продано: {allTovar}</span>
              </div>
              <div>
                <ChartListens data={dataListens}/>
              </div>
            </div>
          </div>
          <div className='text-center'>
              <button className='bg-[#6c6aeb] flex w-full text-slate-200 justify-center py-2 rounded-md' onClick={()=>setChartBof(false)}>
                <div className='flex text-center w-full justify-center'>Вернуться</div>
              </button>
          </div>
        </div>
      ):(
      <>
        {loadings ? (
          <div className='w-full flex justify-center items-center p-20'>
            <svg aria-hidden="true" className="w-16 h-16 text-gray-50 animate-spin fill-gray-800 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" className="fill-zinc-400 dark:fill-gray-200"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        ):(
          <div className='max-w-7xl w-full flex flex-col gap-y-8'>
            <div className='flex w-full justify-center'>
              <span className='text-3xl font-medium text-zinc-800'>Подсчёт наценки</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 w-full flex shadow-md">
              <div className="grid gap-y-4 w-full">
                <div>
                  <h1 className="text-lg text-gray-700 font-bold dark:text-gray-50">Файл с report</h1>
                </div>
                <div className="lg:flex grid gap-4 grid-cols-1 lg:grid-cols-2 w-full">
                  <div className="w-full h-36 relative">
                    <div className="flex w-full h-full items-center border-slate-300 border-2 hover:border-slate-400 dark:border-zinc-600 dark:hover:border-zinc-400 border-dashed rounded-2xl relative justify-center transition-all duration-150">
                      <div className="grid justify-center absolute w-full h-full select-none">
                        <div className="mx-auto mt-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" width="2em" height="2em" className="stroke-gray-900 dark:stroke-gray-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </div>
                        <div className="align-top mt-8 grid gap-y text-center">
                          <span className="text-gray-900 dark:text-gray-50 font-semibold text-base">Добавить файл</span>
                          <span className="text-gray-500 dark:text-gray-400 font-semibold text-xs">(.xlsx)</span>
                        </div>
                        <input type="file" name="track" id="track" ref={inputReport}  className='w-full h-full opacity-0 absolute cursor-pointer rounded-xl' accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 w-full flex shadow-md">
              <div className="grid gap-y-4 w-full">
                <div>
                  <h1 className="text-lg text-gray-700 font-bold dark:text-gray-50">Файл с costs</h1>
                </div>
                <div className="lg:flex grid gap-4 grid-cols-1 lg:grid-cols-2 w-full">
                  <div className="w-full h-36 relative">
                    <div className="flex w-full h-full items-center border-slate-300 border-2 hover:border-slate-400 dark:border-zinc-600 dark:hover:border-zinc-400 border-dashed rounded-2xl relative justify-center transition-all duration-150">
                      <div className="grid justify-center absolute w-full h-full select-none">
                        <div className="mx-auto mt-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" width="2em" height="2em" className="stroke-gray-900 dark:stroke-gray-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </div>
                        <div className="align-top mt-8 grid gap-y text-center">
                          <span className="text-gray-900 dark:text-gray-50 font-semibold text-base">Добавить файл</span>
                          <span className="text-gray-500 dark:text-gray-400 font-semibold text-xs">(.xlsx)</span>
                        </div>
                        <input type="file" name="track" id="track"  ref={inputCosts} className='w-full h-full opacity-0 absolute cursor-pointer rounded-xl'  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col w-full'>
              <span>короче тут артикул</span>
              <input type="text" className='hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full' value={id_tovar} onChange={(e) => SetIdTovar(e.target.value)}/>
            </div>
            <div className='text-center'>
              <button className='bg-[#6c6aeb] flex w-full text-slate-200 justify-center py-2 rounded-md' onClick={CheckReport}>
                <div className='flex text-center w-full justify-center'>проверить</div>
              </button>
            </div>
          </div>
          )}
        </>
      )}
    </main>
  )
}
