using System;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Cross Slash: physical attack with a guaranteed Paralyzed proc on hit.
    /// Ability data must point to script 11010.
    /// </summary>
    [BattleScript(Id)]
    public sealed class CrossSlashScript : IBattleScript
    {
        public const Int32 Id = 11010;

        private readonly BattleCalculator _v;

        public CrossSlashScript(BattleCalculator v)
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

            ApplyParalyzed();
        }

        private void ApplyParalyzed()
        {
            if (_v.Target == null || !_v.Target.IsTargetable)
                return;

            _v.Target.AlterStatus(BattleStatus.CustomStatus24, _v.Caster);
        }
    }
}
