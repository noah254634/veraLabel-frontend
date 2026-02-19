import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';


interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordInput = ({label, className, ...props }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          {...props}
          type={show ? "text" : "password"}
          className={className || "w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};