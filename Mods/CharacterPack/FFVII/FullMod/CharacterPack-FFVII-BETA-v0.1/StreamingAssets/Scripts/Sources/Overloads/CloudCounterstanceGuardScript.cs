using System;
using Memoria.Data;

namespace Memoria.Scripts.Overloads
{
    // Short-circuits incoming physical attacks while Cloud is holding Counterstance so the counter always fires.
    public sealed class CloudCounterstanceGuardScript : IOverloadOnBattleScriptStartScript
    {
        private const Int32 CloudIndex = 50;
        private const BattleAbilityId CounterAbilityId = (BattleAbilityId)11071;
        public Boolean OnBattleScriptStart(BattleCalculator calc)
        {
            if (calc == null)
                return false;

            BattleUnit target = calc.Target;
            BattleUnit caster = calc.Caster;
            BattleCommand command = calc.Command;

            if (target == null || caster == null || command == null)
                return false;
            if (!target.IsPlayer || (Int32)target.PlayerIndex != CloudIndex)
                return false;
            if (!target.IsUnderAnyStatus(BattleStatus.CustomStatus27))
                return false;
            if (!target.IsUnderAnyStatus(BattleStatus.Defend) || target.CurrentHp <= 0)
            {
                target.RemoveStatus(BattleStatus.CustomStatus27);
                return false;
            }
            if ((command.AbilityCategory & 8) == 0)
                return false;

            // Treat the hit as a guard so CalcResult skips the normal damage pipeline.
            calc.Context.Flags &= ~(BattleCalcFlags.Miss | BattleCalcFlags.Dodge);
            calc.Context.Flags |= BattleCalcFlags.Guard;

            target.Flags &= ~(CalcFlag.HpDamageOrHeal | CalcFlag.MpDamageOrHeal);
            target.HpDamage = 0;
            target.MpDamage = 0;

            if (caster.IsPlayer != target.IsPlayer)
            {
                ushort counterTargetId = caster.Data != null ? caster.Data.btl_id : BattleState.GetRandomUnitId(!target.IsPlayer);
                BattleState.EnqueueCounter(target, BattleCommandId.Counter, CounterAbilityId, counterTargetId);

                // Drop the ready flag so multi-hit swings do not enqueue multiple counters.
                target.RemoveStatus(BattleStatus.CustomStatus27);
            }
            return true;
        }
    }
}
