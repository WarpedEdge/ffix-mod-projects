using System;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Blade Beam: Magic AOE that applies Blade Echo on hit.
    /// Ability data must point to script 11011.
    /// </summary>
    [BattleScript(Id)]
    public sealed class BladeBeamScript : IBattleScript
    {
        public const Int32 Id = 11011;

        private readonly BattleCalculator _v;

        public BladeBeamScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.OriginalMagicParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PenaltyMini();
            _v.Target.PenaltyShellAttack();
            _v.BonusElement();

            if (_v.CanAttackMagic())
            {
                _v.CalcHpDamage();
                _v.TryAlterMagicStatuses();
            }

            ApplyBladeEcho();
        }

        private void ApplyBladeEcho()
        {
            if (_v.Target == null || !_v.Target.IsTargetable)
                return;
            if (_v.Target.IsPlayer)
                return;

            _v.Target.TryAlterSingleStatus(BattleStatusId.CustomStatus29, false, _v.Caster, _v.Caster.Id);
        }
    }
}
