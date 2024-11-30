import React, { useState, useEffect } from "react";
import { Tag } from "lucide-react";

const ServicesListRendering: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <section className="w-[375px] h-auto mt-6 bg-slate-200 lg:w-[1440px]">
        <div className="w-[349px] grid grid-cols-1 gap-6 justify-self-center mt-6 lg:w-[1121px] lg:grid-cols-3 lg:grid-rows-3 lg:content-around lg:gap-[37px]">
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
          <article className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px] hover:scale-105"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                ล้างแอร์
              </h1>
              <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                <Tag size={16} color="#7f7676" />
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                เลือกบริการ
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default ServicesListRendering;
