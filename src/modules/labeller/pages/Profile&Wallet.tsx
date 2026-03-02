import { PrimaryButton } from "../components/PrimaryButton";

export const WalletPage = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="bg-gradient-to-br from-blue-900/40 to-[#161B22] p-8 rounded-3xl border border-blue-500/20 flex justify-between items-center">
      <div>
        <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">Available for Payout</p>
        <h2 className="text-5xl font-bold mt-2 font-mono">$142.50</h2>
      </div>
      <PrimaryButton className="px-10 py-4 text-lg">Withdraw to M-Pesa</PrimaryButton>
    </div>

    <div className="bg-[#161B22] rounded-2xl border border-white/5">
      <div className="p-6 border-b border-white/5">
        <h3 className="font-bold">Transaction History</h3>
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="font-bold">Withdrawal to +254 7XX XXX 123</p>
              <p className="text-xs text-gray-500">March {i}, 2026</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-red-400">-$45.00</p>
              <p className="text-[10px] text-green-500 uppercase font-bold">Completed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);