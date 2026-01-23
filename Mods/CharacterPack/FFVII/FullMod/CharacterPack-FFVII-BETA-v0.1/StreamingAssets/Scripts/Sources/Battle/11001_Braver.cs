using System;
using Memoria;
using Memoria.Data;
using Memoria.Prime;
using Memoria.Scripts.Status;

namespace Memoria.Scripts.Battle
{
    [BattleScript(Id)]
    // Custom battle script for the Braver ability.
    public sealed class BraverScript : IBattleScript
    {
        public const Int32 Id = 11001;

        private readonly BattleCalculator _v;

        public BraverScript(BattleCalculator v)
        {
            _v = v;
        }

        // Main entry point when the ability executes.
        public void Perform()
        {
            // Run the standard physical accuracy check first.
            _v.PhysicalAccuracy();
            if (!_v.TryPhysicalHit())
                return;

            // Setup the usual weapon-based damage parameters.
            _v.WeaponPhysicalParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PhysicalPenaltyAndBonusAttack();
            _v.Target.PhysicalPenaltyAndBonusAttack();
            _v.BonusElement();

            // Abort if the weapon element cannot connect (immunities, reflect, etc.).
            if (!_v.CanAttackWeaponElementalCommand())
                return;

            // Deal physical damage as usual.
            _v.CalcHpDamage();
            _v.TryAlterMagicStatuses();

            ApplyDefenseBreak();
        }

        
        // Applies the defence-reduction component of Braver.
        private void ApplyDefenseBreak()
        {
            const BattleStatusId statusId = BattleStatusId.ChangeStat;
            const BattleStatusId braverStatusId = BattleStatusId.CustomStatus23;

            // Refresh the target’s defence value in the calculator before we alter it.
            _v.Target.SetPhysicalDefense();

            // Use the ability’s accuracy (HitRate in Actions.csv) to drive how much DEF is removed.
            Int32 reductionPercent = ClampToRange(_v.Command.HitRate, 0, 100);
            if (reductionPercent <= 0)
                reductionPercent = 25; // fall back to 25% if the ability was configured with 0 accuracy.

            Int32 currentDefence = Math.Max(1, _v.Target.PhysicalDefence);
            DefenseDownStatusScript existingState = _v.Target.GetCurrentStatusEffectScript(braverStatusId) as DefenseDownStatusScript;
            Int32 baseDefence = currentDefence;
            Int32 existingReductionPercent = 0;

            if (existingState != null)
            {
                if (existingState.HasBaseDefence && existingState.BaseDefence > 0)
                    baseDefence = existingState.BaseDefence;
                else
                    baseDefence = Math.Max(1, currentDefence + existingState.TotalDiff);

                existingReductionPercent = ClampToRange(existingState.TotalPercent, 0, 100);
            }
            Int32 targetReductionPercent = Math.Min(100, existingReductionPercent + reductionPercent);

            Int32 newDefence = baseDefence * (100 - targetReductionPercent) / 100;
            newDefence = ClampToRange(newDefence, 0, baseDefence);

            // Only update when we actually lower the stat; otherwise the engine flags the hit as a miss.
            if (newDefence < currentDefence)
            {
                Int32 diffApplied = currentDefence - newDefence;
                Log.Message($"[BraverScript] The target {_v.Target.Name} had {currentDefence} defence, now lowered to {newDefence} (-{diffApplied}).");
                _v.Target.TryAlterSingleStatus(statusId, false, _v.Caster, 0, 6, "PhysicalDefence", newDefence);

                ApplyOrRefreshBraverStatus(braverStatusId, diffApplied, targetReductionPercent, baseDefence);
            }
        }

        // Small helper to avoid retyping the same min/max checks.
        private static Int32 ClampToRange(Int32 value, Int32 min, Int32 max)
        {
            if (value < min)
                return min;
            return (value > max) ? max : value;
        }

        private void ApplyOrRefreshBraverStatus(BattleStatusId braverStatusId, Int32 diffApplied, Int32 totalReductionPercent, Int32 baseDefence)
        {
            _v.Target.TryAlterSingleStatus(braverStatusId, false, _v.Caster, diffApplied, totalReductionPercent, baseDefence);

            DefenseDownStatusScript state = _v.Target.GetCurrentStatusEffectScript(braverStatusId) as DefenseDownStatusScript;
            if (state == null)
                return;

            state.RefreshTurns(3);
            state.NotifyDurationUpdated();
        }
    }
}
