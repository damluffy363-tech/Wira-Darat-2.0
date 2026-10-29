import React from 'react';
import {
  ShoppingBag,
  Package,
  Clock,
  Sparkles,
  ShieldAlert,
  Coins,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { dateFromOffset, shopItems } from '../data/gameData';
import { sound } from '../audio/soundEngine';

export const ShopTab: React.FC = () => {
  const { state, buyItem, useItem, hasItem, language, showToast } = useGame();

  if (!state) return null;

  const isItemAvailable = (it: typeof shopItems[0]) => {
    if (!it.restockEvery) return { ok: true, wait: 0 };
    const lastBought = state.specialItemLastBought?.[it.id];
    if (lastBought === undefined) return { ok: true, wait: 0 };
    const diff = state.months - lastBought;
    const wait = it.restockEvery - diff;
    return { ok: wait <= 0, wait: Math.max(0, wait) };
  };

  const ownedItems = shopItems.filter((it) => (state.inventory[it.id] || 0) > 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88] mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>KEDAI KELENGKAPAN & ORDNANS TENTERA</span>
          </div>
          <h2 className="text-xl font-black text-[#f1f4eb]">Perolehan Alatan & Bekalan Operasi</h2>
          <p className="text-xs text-[#95a890] mt-1 max-w-xl">
            Kelengkapan tugas memberi bonus stamina, prestasi dan disiplin. Peralatan bertempoh perlu diperbaharui selepas tamat tempoh sah perkhidmatan.
          </p>
        </div>

        <div className="bg-[#101b12] border border-[#2d3e2b] px-4 py-2.5 rounded-xl text-right">
          <span className="text-[10px] text-[#7d9078] font-mono block">DANA SEMASA</span>
          <span className="text-lg font-bold font-mono text-[#e5d898]">
            RM {state.money.toLocaleString('en-MY')}
          </span>
        </div>
      </div>

      {/* Equipment Catalog Grid */}
      <div>
        <h3 className="text-base font-bold text-[#eff4ea] mb-3">Katalog Barangan & Kelengkapan</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((it) => {
            const qty = state.inventory[it.id] || 0;
            const active = it.type === 'gear' && hasItem(it.id);
            const exp = state.itemExpiry[it.id];
            const remaining = Number.isFinite(exp) ? Math.max(0, exp - state.months) : 0;
            const expired = it.type === 'gear' && Number.isFinite(exp) && exp <= state.months;
            const stock = isItemAvailable(it);
            const canAfford = state.money >= it.price;
            const locked = (it.type === 'gear' && active) || !canAfford || !stock.ok || state.retired;

            return (
              <div
                key={it.id}
                className="bg-gradient-to-br from-[#18281d] to-[#111c13] border border-[#394d37] hover:border-[#6f8858] rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        it.type === 'gear'
                          ? active
                            ? 'bg-[#253926] text-[#86c476] border border-[#486b47]'
                            : expired
                            ? 'bg-[#3b2321] text-[#e89083] border border-[#6b3c37]'
                            : 'bg-[#1e2a20] text-[#a9bca5] border border-[#364835]'
                          : 'bg-[#292e1f] text-[#dfcd8d] border border-[#5c5731]'
                      }`}
                    >
                      {it.type === 'gear'
                        ? active
                          ? `Aktif (${remaining} bln)`
                          : expired
                          ? 'Telah Luput'
                          : `${it.lifeMonths} Bulan Sah`
                        : 'Guna Habis'}
                    </span>

                    <span className="text-sm font-bold font-mono text-[#dfce88]">
                      RM {it.price.toLocaleString('en-MY')}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#f1f5ec] mb-1">{it.name}</h4>
                  <p className="text-xs text-[#a9bba4] leading-relaxed mb-3">{it.desc}</p>

                  <div className="text-[11px] text-[#c6d7be] bg-[#101b12] p-2 rounded-lg border border-[#2b3c2a] flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#dfce88] shrink-0" />
                    <span>{it.effect}</span>
                  </div>

                  {!stock.ok && (
                    <div className="text-[10px] text-[#e5b376] mt-2 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>Stok dibuka semula dalam {stock.wait} bulan lagi</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#293928]">
                  <button
                    onClick={() => buyItem(it.id)}
                    disabled={locked}
                    className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      locked
                        ? 'bg-[#1a251c] text-[#637562] border-[#314230] cursor-not-allowed'
                        : 'bg-[#334b35] hover:bg-[#405f42] text-[#f2f7ee] border-[#5a7b56] active:scale-95 shadow'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5 text-[#dfce88]" />
                    <span>
                      {it.type === 'gear' && active
                        ? 'Kelengkapan Masih Sah'
                        : it.type === 'gear' && expired
                        ? 'Perbaharui Kelengkapan'
                        : !canAfford
                        ? 'Wang Tidak Mencukupi'
                        : !stock.ok
                        ? 'Stok Belum Dibuka'
                        : 'Beli Sekarang'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Soldier Inventory */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88] mb-3">
          <Package className="w-4 h-4" />
          <span>INVENTORI & ALATAN DIMILIKI</span>
        </div>

        {ownedItems.length === 0 ? (
          <p className="text-xs text-[#8da088] py-4 text-center">
            Inventori anda masih kosong. Dapatkan peralatan dari kedai untuk meningkatkan stamina dan pertahanan.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ownedItems.map((it) => {
              const qty = state.inventory[it.id] || 0;
              const active = it.type === 'gear' && hasItem(it.id);
              const exp = state.itemExpiry[it.id];
              const remaining = Number.isFinite(exp) ? Math.max(0, exp - state.months) : 0;

              return (
                <div
                  key={it.id}
                  className="bg-[#121e15] border border-[#2e412c] p-3.5 rounded-xl flex flex-col justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#e8f1e4] text-sm">{it.name}</span>
                      <span className="font-mono text-[#dfce88] text-[11px]">Kuantiti: {qty}</span>
                    </div>
                    <span className="text-[11px] text-[#9bb097] block leading-relaxed">{it.effect}</span>
                  </div>

                  <div className="pt-2 border-t border-[#273826] flex items-center justify-between">
                    {it.type === 'consumable' ? (
                      <button
                        onClick={() => useItem(it.id)}
                        className="w-full py-1.5 px-3 rounded-lg bg-[#384f39] hover:bg-[#456346] text-[#f2f7ec] font-bold text-xs border border-[#587955] cursor-pointer"
                      >
                        Gunakan Item Sekarang
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-[#8fa38b]">
                        {active
                          ? `Sah sehingga ${dateFromOffset(exp)} (${remaining} bln)`
                          : 'Telah luput. Sila beli semula.'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
