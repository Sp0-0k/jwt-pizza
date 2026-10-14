import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function View(props: Props) {
  return (
    <>
      <div className="bg-slate-600 flex flex-col justify-center sm:items-center mx-auto">
        <div>
          <div className="text-center flex flex-col justify-between bg-orange-800">
            <h2 className="my-1 sm:my-3 text-4xl font-display font-normal uppercase tracking-wide sm:text-6xl">
              <span className="text-yellow-200">{props.title}</span>
            </h2>
          </div>

          {props.children}
        </div>
      </div>
    </>
  );
}
