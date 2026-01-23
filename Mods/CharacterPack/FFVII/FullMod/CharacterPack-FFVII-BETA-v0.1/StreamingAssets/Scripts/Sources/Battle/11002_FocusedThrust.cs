using System;
using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Focused Thrust – single-target thrust that rewards the caster with trance.
    /// Ability data points to script 11002.
    /// </summary>
    [BattleScript(Id)]
    public sealed class FocusedThrustScript : IBattleScript
    {
        public const Int32 Id = 11002;

        private readonly BattleCalculator _v;

        public FocusedThrustScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.PhysicalAccuracy();
            if (!_v.TryPhysicalHit())
                return;

            // Reuse the standard weapon-based physical damage pipeline.
            _v.WeaponPhysicalParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PhysicalPenaltyAndBonusAttack();
            _v.Target.PhysicalPenaltyAndBonusAttack();
            _v.BonusElement();

            if (!_v.CanAttackWeaponElementalCommand())
                return;

            _v.CalcHpDamage();
            _v.TryAlterMagicStatuses();

            // Add trance to Cloud based on Spirit and finishers.
            ApplyTranceGain();
        }

        private void ApplyTranceGain()
        {
            if (!_v.Caster.IsPlayer)
                return;

            Int32 spirit = _v.Caster.Will;
            AddTrance((spirit / 4) + 12);

            Boolean dealsDamage = _v.Target.HpDamage > 0 || (_v.Context.Flags & BattleCalcFlags.DirectHP) != 0;
            Boolean kill = dealsDamage
                && _v.Target.IsPlayer != _v.Caster.IsPlayer
                && _v.Target.HpDamage >= (Int32)_v.Target.CurrentHp;

            if (kill)
                AddTrance((spirit / 2) + 24);
        }

        private void AddTrance(Int32 amount)
        {
            if (amount <= 0)
                return;

            Int32 newValue = Math.Min(255, _v.Caster.Trance + amount);
            _v.Caster.Trance = (Byte)newValue;
        }
    }
}
