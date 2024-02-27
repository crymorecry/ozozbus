'use client';
import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ChartListens({data}:any) {
  const myDivRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDivWidth(entry.contentRect.width);
      }
    });

    if (myDivRef.current) {
      observer.observe(myDivRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [divWidth]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0];
      return (
        <div className="dark:bg-zinc-900 bg-white p-4 rounded-md flex flex-col gap-y-1 border border-slate-300 dark:border-zinc-700">
        <p className='text-gray-900 dark:text-gray-50 text-sm'>{` ${dataPoint.payload.name}`}</p>
          <p className='text-gray-900 dark:text-gray-50 text-sm'>{`Продано товаров: ${dataPoint.value}`}</p>
          <div className='border-2 border-indigo-700 w-12 rounded-md'></div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-fit" ref={myDivRef}>
      <LineChart width={divWidth-32} height={240} data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: '12px' }} />
        <YAxis tick={{ fill: '#6b7280', fontSize: '12px' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="uv" stroke="#4f46e5" />
      </LineChart>
    </div>
  );
}
