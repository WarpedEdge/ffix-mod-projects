using System;
using FF9;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Climhazzard: two-hit physical attack. Strips buffs and applies 100% DEF down for 3 turns.
    /// Damage limit break is enabled for this command.
    /// Ability data must point to script 11013.
    /// </summary>
    [BattleScript(Id)]
    public sealed class ClimhazzardScript : IBattleScript
    {
        public const Int32 Id = 11013;

        private readonly BattleCalculator _v;

        public ClimhazzardScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.PhysicalAccuracy();
            if (!_v.TryPhysicalHit())
                return;

            _v.WeaponPhysicalParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PhysicalPenaltyAndBonusAttack();
            _v.Target.PhysicalPenaltyAndBonusAttack();
            _v.BonusElement();

            if (!_v.CanAttackWeaponElementalCommand())
                return;

            _v.CalcHpDamage();
            _v.TryAlterMagicStatuses();

            StripBuffs();
            ApplyDefenseDown();
        }

        private void StripBuffs()
        {
            BattleTarget target = _v.Target;
            if (target == null || !target.IsTargetable)
                return;

            target.RemoveStatus(BattleStatusConst.AnyPositive);
        }

        private void ApplyDefenseDown()
        {
            BattleTarget target = _v.Target;
            if (target == null || !target.IsTargetable)
                return;

            target.SetPhysicalDefense();
            Int32 baseDefense = Math.Max(1, target.PhysicalDefence);
            Int32 newDefense = 0;
            Int32 diffApplied = baseDefense - newDefense;

            btl_stat.AlterStatus(target, BattleStatusId.ChangeStat, _v.Caster, false, 0, 6, "PhysicalDefence", newDefense);
            target.TryAlterSingleStatus(BattleStatusId.CustomStatus23, false, _v.Caster, diffApplied, 100, baseDefense);
        }
    }
}
