import React from 'react';
const Placeholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-[#1A1E29] border border-white/5 p-8 rounded-2xl shadow-xl shadow-black/20">
        <h2 className="font-sora text-xl font-bold">{title}</h2>
        <p className="text-[#8A8FA8] mt-2">This section is under development.</p>
    </div>
);
export default Placeholder;
